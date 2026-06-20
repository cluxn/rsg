import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import { query } from '../db/connection';
import { sendLeadNotificationEmail } from './notification.service';

interface CreateLeadInput {
  name: string;
  phone?: string;
  email?: string;
  product_interest?: string;
  message?: string;
  source_page?: string;
}

export async function createLead(input: CreateLeadInput): Promise<number> {
  const { name, phone, email, product_interest, message, source_page } = input;
  const result = await query<{ insertId: number }>(
    'INSERT INTO leads (name, phone, email, product_interest, message, source_page) VALUES (?, ?, ?, ?, ?, ?)',
    [name, phone ?? null, email ?? null, product_interest ?? null, message ?? null, source_page ?? 'contact']
  );
  const leadId = (result as any).insertId as number;

  // Fire n8n webhook — failure is silent (D-07: lead is already in DB, source of truth)
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, name, phone, email, product_interest, message, source_page }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        await query('UPDATE leads SET webhook_sent = TRUE WHERE id = ?', [leadId]);
      }
    } catch {
      // Webhook failure is intentionally swallowed (D-07)
    }
  }

  // Fire email notification — failure is silent (D-12: lead is already in DB)
  try {
    const sent = await sendLeadNotificationEmail({
      id: leadId,
      name,
      phone,
      email,
      product_interest,
      message,
      source_page,
      created_at: new Date().toISOString(),
    });
    if (sent) {
      await query('UPDATE leads SET email_sent = TRUE WHERE id = ?', [leadId]);
    }
  } catch {
    // Email failure intentionally swallowed (D-12)
  }

  return leadId;
}

export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'converted' | 'closed' | 'lost' | 'junk';

interface LeadRow {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  lead_status: LeadStatus;
  follow_up_date: string | null;
  notes: string | null;
  last_contact_date: string | null;
  webhook_sent: boolean;
  email_sent: boolean;
  created_at: string;
}

const LEAD_SELECT = 'id, name, phone, email, product_interest, message, source_page, lead_status, follow_up_date, notes, last_contact_date, webhook_sent, email_sent, created_at';

export interface LeadFilters {
  search?: string;
  source_page?: string;
  date_from?: string;
  date_to?: string;
}

export async function getLeads(page: number, limit: number, filters?: LeadFilters): Promise<{ leads: LeadRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.search) {
    conditions.push('(name LIKE ? OR phone LIKE ? OR email LIKE ?)');
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }
  if (filters?.source_page) {
    conditions.push('source_page = ?');
    params.push(filters.source_page);
  }
  if (filters?.date_from) {
    conditions.push('DATE(created_at) >= ?');
    params.push(filters.date_from);
  }
  if (filters?.date_to) {
    conditions.push('DATE(created_at) <= ?');
    params.push(filters.date_to);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const leads = await query<LeadRow>(
    `SELECT ${LEAD_SELECT} FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countResult = await query<{ total: number }>(
    `SELECT COUNT(*) as total FROM leads ${where}`,
    params
  );
  const total = countResult[0]?.total ?? 0;
  return { leads, total };
}

export async function updateLead(id: number, data: {
  lead_status?: LeadStatus;
  follow_up_date?: string | null;
  notes?: string | null;
  last_contact_date?: string | null;
}): Promise<void> {
  const fields: string[] = [];
  const params: (string | null)[] = [];

  if (data.lead_status !== undefined) { fields.push('lead_status = ?'); params.push(data.lead_status); }
  if (data.follow_up_date !== undefined) { fields.push('follow_up_date = ?'); params.push(data.follow_up_date); }
  if (data.notes !== undefined) { fields.push('notes = ?'); params.push(data.notes); }
  if (data.last_contact_date !== undefined) { fields.push('last_contact_date = ?'); params.push(data.last_contact_date); }

  if (!fields.length) return;
  await query(`UPDATE leads SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
}

export async function exportLeadsToCSV(): Promise<string> {
  const leads = await query<LeadRow>(
    'SELECT id, name, phone, email, product_interest, message, source_page, webhook_sent, email_sent, created_at FROM leads ORDER BY created_at DESC'
  );
  return stringify(leads as unknown as Record<string, unknown>[], {
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'phone', header: 'Phone' },
      { key: 'email', header: 'Email' },
      { key: 'product_interest', header: 'Product Interest' },
      { key: 'message', header: 'Message' },
      { key: 'source_page', header: 'Source Page' },
      { key: 'webhook_sent', header: 'Webhook Sent' },
      { key: 'email_sent', header: 'Email Sent' },
      { key: 'created_at', header: 'Submitted At' },
    ],
  });
}

export async function importLeadsFromCSV(buffer: Buffer): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const rows: Record<string, string>[] = parse(buffer, { columns: true, skip_empty_lines: true });
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = row['name'] ?? row['Name'] ?? '';
    if (!name.trim()) { skipped++; continue; }
    try {
      await createLead({
        name: name.trim(),
        phone: row['phone'] ?? row['Phone'] ?? undefined,
        email: row['email'] ?? row['Email'] ?? undefined,
        product_interest: row['product_interest'] ?? row['Product Interest'] ?? undefined,
        message: row['message'] ?? row['Message'] ?? undefined,
        source_page: row['source_page'] ?? row['Source Page'] ?? 'import',
      });
      imported++;
    } catch (err) {
      errors.push(`Row "${name}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { imported, skipped, errors };
}

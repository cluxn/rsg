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

interface LeadRow {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  webhook_sent: boolean;
  email_sent: boolean;
  created_at: string;
}

export async function getLeads(page: number, limit: number): Promise<{ leads: LeadRow[]; total: number }> {
  const offset = (page - 1) * limit;
  const leads = await query<LeadRow>(
    'SELECT id, name, phone, email, product_interest, message, source_page, webhook_sent, email_sent, created_at FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const countResult = await query<{ total: number }>('SELECT COUNT(*) as total FROM leads');
  const total = countResult[0]?.total ?? 0;
  return { leads, total };
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

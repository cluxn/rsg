import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import ExcelJS from 'exceljs';
import { query } from '../db/connection';
import { sendLeadNotificationEmail } from './notification.service';

interface CreateLeadInput {
  name: string;
  phone?: string;
  email?: string;
  product_interest?: string;
  message?: string;
  source_page?: string;
  city?: string;
  state?: string;
}

export async function createLead(input: CreateLeadInput): Promise<number> {
  const { name, phone, email, product_interest, message, source_page, city, state } = input;
  const result = await query<{ insertId: number }>(
    'INSERT INTO leads (name, phone, email, product_interest, message, source_page, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone ?? null, email ?? null, product_interest ?? null, message ?? null, source_page ?? 'contact', city ?? null, state ?? null]
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
export type LeadPriority = 'none' | 'cold' | 'warm' | 'hot';

interface LeadRow {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  city: string | null;
  state: string | null;
  lead_status: LeadStatus;
  priority: LeadPriority;
  follow_up_date: string | null;
  notes: string | null;
  last_contact_date: string | null;
  webhook_sent: boolean;
  email_sent: boolean;
  created_at: string;
}

const LEAD_SELECT = 'id, name, phone, email, product_interest, message, source_page, city, state, lead_status, priority, follow_up_date, notes, last_contact_date, webhook_sent, email_sent, created_at';

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
  priority?: LeadPriority;
  follow_up_date?: string | null;
  notes?: string | null;
  last_contact_date?: string | null;
}): Promise<void> {
  const fields: string[] = [];
  const params: (string | null)[] = [];

  if (data.lead_status !== undefined) { fields.push('lead_status = ?'); params.push(data.lead_status); }
  if (data.priority !== undefined) { fields.push('priority = ?'); params.push(data.priority); }
  if (data.follow_up_date !== undefined) { fields.push('follow_up_date = ?'); params.push(data.follow_up_date); }
  if (data.notes !== undefined) { fields.push('notes = ?'); params.push(data.notes); }
  if (data.last_contact_date !== undefined) { fields.push('last_contact_date = ?'); params.push(data.last_contact_date); }

  if (!fields.length) return;
  await query(`UPDATE leads SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
}

export async function bulkUpdateLeadStatus(ids: number[], lead_status: LeadStatus): Promise<void> {
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(', ');
  await query(`UPDATE leads SET lead_status = ? WHERE id IN (${placeholders})`, [lead_status, ...ids]);
}

export async function bulkDeleteLeads(ids: number[]): Promise<void> {
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(', ');
  await query(`DELETE FROM leads WHERE id IN (${placeholders})`, ids);
}

export async function checkDuplicatePhone(phone: string): Promise<{ exists: boolean; lead_id?: number; name?: string }> {
  const rows = await query<{ id: number; name: string }>(
    'SELECT id, name FROM leads WHERE phone = ? LIMIT 1',
    [phone]
  );
  if (rows[0]) return { exists: true, lead_id: rows[0].id, name: rows[0].name };
  return { exists: false };
}

export async function getLeadSourceBreakdown(): Promise<{ source_page: string; count: number }[]> {
  return query<{ source_page: string; count: number }>(
    `SELECT COALESCE(source_page, 'unknown') as source_page, COUNT(*) as count
     FROM leads GROUP BY source_page ORDER BY count DESC LIMIT 10`
  );
}

export async function getLeadFunnelCounts(): Promise<{ new: number; contacted: number; converted: number }> {
  const rows = await query<{ lead_status: string; cnt: number }>(
    `SELECT lead_status, COUNT(*) as cnt FROM leads WHERE lead_status IN ('new','contacted','converted') GROUP BY lead_status`
  );
  const map: Record<string, number> = {};
  rows.forEach(r => { map[r.lead_status] = Number(r.cnt); });
  return { new: map['new'] ?? 0, contacted: map['contacted'] ?? 0, converted: map['converted'] ?? 0 };
}

export async function exportLeadsToCSV(): Promise<string> {
  const leads = await query<LeadRow>(
    'SELECT id, name, phone, email, product_interest, message, source_page, city, state, webhook_sent, email_sent, created_at FROM leads ORDER BY created_at DESC'
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
      { key: 'city', header: 'City' },
      { key: 'state', header: 'State' },
      { key: 'webhook_sent', header: 'Webhook Sent' },
      { key: 'email_sent', header: 'Email Sent' },
      { key: 'created_at', header: 'Submitted At' },
    ],
  });
}

const EXCEL_COLUMNS = [
  { key: 'id',               header: 'ID',               width: 8 },
  { key: 'name',             header: 'Name',             width: 22 },
  { key: 'phone',            header: 'Phone',            width: 16 },
  { key: 'email',            header: 'Email',            width: 28 },
  { key: 'product_interest', header: 'Product Interest', width: 26 },
  { key: 'message',          header: 'Message',          width: 40 },
  { key: 'source_page',      header: 'Source Page',      width: 18 },
  { key: 'city',             header: 'City',             width: 16 },
  { key: 'state',            header: 'State',            width: 16 },
  { key: 'lead_status',      header: 'Lead Status',      width: 18 },
  { key: 'webhook_sent',     header: 'Webhook Sent',     width: 14 },
  { key: 'email_sent',       header: 'Email Sent',       width: 12 },
  { key: 'created_at',       header: 'Submitted At',     width: 20 },
];

function buildWorkbook(rows: LeadRow[]): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'RSG Profile Manufacturing';
  const ws = wb.addWorksheet('Leads');

  ws.columns = EXCEL_COLUMNS.map(c => ({ header: c.header, key: c.key, width: c.width }));

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B2B4B' } };
  headerRow.alignment = { vertical: 'middle' };
  headerRow.height = 20;

  rows.forEach(lead => {
    ws.addRow({
      id: lead.id,
      name: lead.name,
      phone: lead.phone ?? '',
      email: lead.email ?? '',
      product_interest: lead.product_interest ?? '',
      message: lead.message ?? '',
      source_page: lead.source_page ?? '',
      city: lead.city ?? '',
      state: lead.state ?? '',
      lead_status: lead.lead_status,
      webhook_sent: lead.webhook_sent ? 'Yes' : 'No',
      email_sent: lead.email_sent ? 'Yes' : 'No',
      created_at: lead.created_at,
    });
  });

  // Alternate row shading
  ws.eachRow((row, rowNum) => {
    if (rowNum === 1) return;
    if (rowNum % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F7FA' } };
    }
  });

  // Freeze header
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  return wb;
}

export async function exportLeadsToExcel(): Promise<Buffer> {
  const leads = await query<LeadRow>(
    'SELECT id, name, phone, email, product_interest, message, source_page, city, state, lead_status, webhook_sent, email_sent, created_at FROM leads ORDER BY created_at DESC'
  );
  const wb = buildWorkbook(leads);
  return wb.xlsx.writeBuffer() as unknown as Promise<Buffer>;
}

export async function generateLeadSampleExcel(): Promise<Buffer> {
  const sampleRows: LeadRow[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@example.com',
      product_interest: 'Colour Coated Roofing Sheet',
      message: 'Need 500 sheets for factory shed. Please quote.',
      source_page: 'home',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      lead_status: 'new',
      follow_up_date: null,
      notes: null,
      last_contact_date: null,
      webhook_sent: true,
      email_sent: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '9123456789',
      email: 'priya@company.in',
      product_interest: 'MS Pipe',
      message: 'Looking for bulk MS pipes for construction project.',
      source_page: 'contact',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      lead_status: 'contacted',
      follow_up_date: null,
      notes: null,
      last_contact_date: null,
      webhook_sent: true,
      email_sent: false,
      created_at: new Date().toISOString(),
    },
  ];
  const wb = buildWorkbook(sampleRows);
  return wb.xlsx.writeBuffer() as unknown as Promise<Buffer>;
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

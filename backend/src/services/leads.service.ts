import { query } from '../db/connection';

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

  return leadId;
}

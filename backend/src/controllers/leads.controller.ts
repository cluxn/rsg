import type { Request, Response } from 'express';
import { z } from 'zod';
import { createLead, getLeads, updateLead, exportLeadsToCSV, exportLeadsToExcel, generateLeadSampleExcel, importLeadsFromCSV, bulkUpdateLeadStatus, bulkDeleteLeads, checkDuplicatePhone, getLeadSourceBreakdown, getLeadFunnelCounts } from '../services/leads.service';
import type { LeadStatus } from '../services/leads.service';
import { query } from '../db/connection';

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  product_interest: z.string().max(255).optional(),
  message: z.string().max(2000).optional(),
  source_page: z.string().max(255).optional(),
  city: z.string().max(255).optional(),
  state: z.string().max(255).optional(),
}).refine(data => data.phone || data.email, {
  message: 'Either phone or email is required',
  path: ['phone'],
});

export async function submitLead(req: Request, res: Response): Promise<void> {
  if (req.body._hp) { res.status(200).json({ success: true }); return; }
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  try {
    const leadId = await createLead(parsed.data);
    res.status(201).json({ success: true, leadId });
  } catch (err) {
    console.error('createLead error:', err);
    res.status(500).json({ error: 'Failed to record your enquiry. Please try again.' });
  }
}

export async function listLeads(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '25'), 10)));
  try {
    const { leads, total } = await getLeads(page, limit, {
      search: req.query.search ? String(req.query.search) : undefined,
      source_page: req.query.source_page ? String(req.query.source_page) : undefined,
      date_from: req.query.date_from ? String(req.query.date_from) : undefined,
      date_to: req.query.date_to ? String(req.query.date_to) : undefined,
    });
    res.json({ leads, total, page, limit });
  } catch (err) {
    console.error('listLeads error:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

export async function updateLeadHandler(req: Request, res: Response): Promise<void> {
  try {
    await updateLead(Number(req.params.id), req.body as Parameters<typeof updateLead>[1]);
    res.json({ ok: true });
  } catch (err) {
    console.error('updateLead error:', err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
}

export async function deleteLeadHandler(req: Request, res: Response): Promise<void> {
  try {
    await query('DELETE FROM leads WHERE id = ?', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteLead error:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
}

export async function exportLeads(req: Request, res: Response): Promise<void> {
  const format = req.query.format === 'xlsx' ? 'xlsx' : 'csv';
  const date = new Date().toISOString().slice(0, 10);
  try {
    if (format === 'xlsx') {
      const buffer = await exportLeadsToExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="rsg-leads-${date}.xlsx"`);
      res.send(buffer);
    } else {
      const csv = await exportLeadsToCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="rsg-leads-${date}.csv"`);
      res.send(csv);
    }
  } catch (err) {
    console.error('exportLeads error:', err);
    res.status(500).json({ error: 'Export failed' });
  }
}

export async function downloadLeadSample(req: Request, res: Response): Promise<void> {
  try {
    const buffer = await generateLeadSampleExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="rsg-leads-import-sample.xlsx"');
    res.send(buffer);
  } catch (err) {
    console.error('downloadLeadSample error:', err);
    res.status(500).json({ error: 'Sample generation failed' });
  }
}

export async function importLeads(req: Request, res: Response): Promise<void> {
  if (!req.file) { res.status(400).json({ error: 'No CSV file uploaded' }); return; }
  try {
    const result = await importLeadsFromCSV(req.file.buffer);
    res.json(result);
  } catch (err) {
    console.error('importLeads error:', err);
    res.status(500).json({ error: 'Import failed' });
  }
}

export async function bulkLeadsHandler(req: Request, res: Response): Promise<void> {
  const { action, ids, lead_status } = req.body as { action: string; ids: number[]; lead_status?: string };
  if (!Array.isArray(ids) || ids.length === 0) { res.status(400).json({ error: 'ids required' }); return; }
  try {
    if (action === 'delete') {
      await bulkDeleteLeads(ids);
      res.json({ ok: true, affected: ids.length });
    } else if (action === 'status' && lead_status) {
      await bulkUpdateLeadStatus(ids, lead_status as LeadStatus);
      res.json({ ok: true, affected: ids.length });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('bulkLeads error:', err);
    res.status(500).json({ error: 'Bulk operation failed' });
  }
}

export async function checkDuplicatePhoneHandler(req: Request, res: Response): Promise<void> {
  const phone = String(req.query.phone ?? '').trim();
  if (!phone) { res.status(400).json({ error: 'phone required' }); return; }
  try {
    res.json(await checkDuplicatePhone(phone));
  } catch (err) {
    console.error('checkDuplicatePhone error:', err);
    res.status(500).json({ error: 'Check failed' });
  }
}

export async function leadStatsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const [sources, funnel] = await Promise.all([getLeadSourceBreakdown(), getLeadFunnelCounts()]);
    res.json({ sources, funnel });
  } catch (err) {
    console.error('leadStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

export async function createLeadAdmin(req: Request, res: Response): Promise<void> {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  try {
    const leadId = await createLead(parsed.data);
    res.status(201).json({ success: true, leadId });
  } catch (err) {
    console.error('createLeadAdmin error:', err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
}

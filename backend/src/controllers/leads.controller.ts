import type { Request, Response } from 'express';
import { z } from 'zod';
import { createLead } from '../services/leads.service';

const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  product_interest: z.string().max(255).optional(),
  message: z.string().max(2000).optional(),
  source_page: z.string().max(255).optional(),
}).refine(data => data.phone || data.email, {
  message: 'Either phone or email is required',
  path: ['phone'],
});

export async function submitLead(req: Request, res: Response): Promise<void> {
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

import { Request, Response } from 'express';
import { z } from 'zod';
import {
  listActiveTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/testimonials.service';

const createTestimonialSchema = z.object({
  text: z.string().min(1),
  author_name: z.string().min(1),
  author_city: z.string().optional(),
  author_image: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  product_bought: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['google', 'indiamart', 'justdial', 'other']).default('google'),
  active: z.boolean().default(true),
});

export async function getActiveTestimonials(_req: Request, res: Response): Promise<void> {
  res.json(await listActiveTestimonials());
}

export async function getAllTestimonialsAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllTestimonials());
}

export async function createTestimonialHandler(req: Request, res: Response): Promise<void> {
  const parsed = createTestimonialSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const result = await createTestimonial(parsed.data) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateTestimonialHandler(req: Request, res: Response): Promise<void> {
  await updateTestimonial(Number(req.params.id), req.body as Record<string, unknown>);
  res.json({ ok: true });
}

export async function deleteTestimonialHandler(req: Request, res: Response): Promise<void> {
  await deleteTestimonial(Number(req.params.id));
  res.json({ ok: true });
}

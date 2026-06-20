import { Request, Response } from 'express';
import { z } from 'zod';
import {
  listPublishedEvents,
  getEventBySlug,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/events.service';

const createEventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().default(''),
  event_type: z.string().optional(),
  location: z.string().optional(),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  event_date: z.string().optional(),
  end_date: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  scheduled_at: z.string().nullable().optional(),
});

export async function getPublishedEvents(_req: Request, res: Response): Promise<void> {
  res.json(await listPublishedEvents());
}

export async function getEventBySlugHandler(req: Request, res: Response): Promise<void> {
  const event = await getEventBySlug(String(req.params.slug));
  if (!event) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(event);
}

export async function getAllEventsAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllEvents());
}

export async function createEventHandler(req: Request, res: Response): Promise<void> {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const result = await createEvent(parsed.data) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateEventHandler(req: Request, res: Response): Promise<void> {
  await updateEvent(Number(req.params.id), req.body as Record<string, unknown>);
  res.json({ ok: true });
}

export async function deleteEventHandler(req: Request, res: Response): Promise<void> {
  await deleteEvent(Number(req.params.id));
  res.json({ ok: true });
}

import type { Request, Response } from 'express';
import { z } from 'zod';
import { subscribeNewsletter, getSubscribers, deleteSubscriber, exportSubscribersToCSV } from '../services/newsletter.service';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  name: z.string().max(255).optional(),
});

export async function subscribe(req: Request, res: Response): Promise<void> {
  if (req.body._hp) { res.status(200).json({ success: true }); return; }
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  try {
    await subscribeNewsletter(parsed.data.email, parsed.data.name);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}

export async function listSubscribers(req: Request, res: Response): Promise<void> {
  try {
    const subscribers = await getSubscribers();
    res.json({ subscribers, total: subscribers.length });
  } catch (err) {
    console.error('listSubscribers error:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
}

export async function removeSubscriber(req: Request, res: Response): Promise<void> {
  try {
    await deleteSubscriber(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error('removeSubscriber error:', err);
    res.status(500).json({ error: 'Failed to remove subscriber' });
  }
}

export async function exportSubscribers(req: Request, res: Response): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  try {
    const csv = await exportSubscribersToCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="rsg-newsletter-${date}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error('exportSubscribers error:', err);
    res.status(500).json({ error: 'Failed to export' });
  }
}

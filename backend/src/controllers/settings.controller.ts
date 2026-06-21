import { Request, Response } from 'express';
import { getAllSettings, upsertSetting } from '../services/settings.service';

export async function getSettings(_req: Request, res: Response): Promise<void> {
  res.json(await getAllSettings());
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  for (const [key, value] of Object.entries(body)) {
    if (typeof key === 'string' && key.length > 0 && typeof value === 'string') {
      await upsertSetting(key, value);
    }
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  fetch(`${frontendUrl}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET, tag: 'settings' }),
  }).catch(() => {});

  res.json({ ok: true });
}

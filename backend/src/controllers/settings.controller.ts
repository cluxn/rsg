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
  res.json({ ok: true });
}

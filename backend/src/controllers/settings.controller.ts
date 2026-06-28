import { Request, Response } from 'express';
import { getAllSettings, upsertSetting } from '../services/settings.service';

// Keys that should NOT be exported (secrets)
const SENSITIVE_KEYS = new Set(['smtp_password', 'smtp_host', 'smtp_user', 'smtp_port']);

export async function getSettings(_req: Request, res: Response): Promise<void> {
  res.json(await getAllSettings());
}

export async function exportSettings(_req: Request, res: Response): Promise<void> {
  const all = await getAllSettings();
  const safe: Record<string, string> = {};
  for (const [k, v] of Object.entries(all)) {
    if (!SENSITIVE_KEYS.has(k)) safe[k] = v;
  }
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="rsg-settings-${date}.json"`);
  res.send(JSON.stringify(safe, null, 2));
}

export async function importSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  if (typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ error: 'JSON object expected' });
    return;
  }
  let imported = 0;
  for (const [key, value] of Object.entries(body)) {
    if (typeof key === 'string' && key.length > 0 && typeof value === 'string' && !SENSITIVE_KEYS.has(key)) {
      await upsertSetting(key, value);
      imported++;
    }
  }
  res.json({ ok: true, imported });
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

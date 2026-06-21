import { Request, Response } from 'express';
import { z } from 'zod';
import { recordNotFound, listNotFoundLogs } from '../services/not_found_logs.service';

const reportSchema = z.object({
  url: z.string().min(1).max(500),
});

export async function reportNotFound(req: Request, res: Response): Promise<void> {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const referrer = req.get('referer') ?? null;
  const userAgent = req.get('user-agent') ?? null;
  await recordNotFound(parsed.data.url, referrer, userAgent);
  res.status(204).end();
}

export async function getNotFoundLogs(_req: Request, res: Response): Promise<void> {
  res.json(await listNotFoundLogs());
}

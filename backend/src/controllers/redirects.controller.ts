import { Request, Response } from 'express';
import { z } from 'zod';
import { listRedirects, listActiveRedirects, createRedirect, updateRedirect, deleteRedirect } from '../services/redirects.service';

const redirectSchema = z.object({
  from_path: z.string().min(1).max(500),
  to_path: z.string().min(1).max(500),
  status_code: z.number().int().refine(v => v === 301 || v === 302).default(301),
});

export async function getRedirects(_req: Request, res: Response): Promise<void> {
  res.json(await listRedirects());
}

export async function getActiveRedirects(_req: Request, res: Response): Promise<void> {
  res.json(await listActiveRedirects());
}

export async function addRedirect(req: Request, res: Response): Promise<void> {
  const parsed = redirectSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const { from_path, to_path, status_code } = parsed.data;
  try {
    await createRedirect(from_path, to_path, status_code);
    res.status(201).json({ ok: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') { res.status(409).json({ error: 'A redirect from that path already exists.' }); return; }
    throw err;
  }
}

export async function editRedirect(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const parsed = redirectSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  if ('active' in req.body) parsed.data.active = Boolean(req.body.active);
  await updateRedirect(id, { ...parsed.data, active: req.body.active !== undefined ? Boolean(req.body.active) : undefined });
  res.json({ ok: true });
}

export async function removeRedirect(req: Request, res: Response): Promise<void> {
  await deleteRedirect(Number(req.params.id));
  res.json({ ok: true });
}

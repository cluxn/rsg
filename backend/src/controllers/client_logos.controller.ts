import { Request, Response } from 'express';
import {
  getAllClientLogos, getVisibleClientLogos, createClientLogo,
  updateClientLogo, deleteClientLogo, reorderClientLogos,
} from '../services/client_logos.service';

export async function getClientLogosPublic(_req: Request, res: Response): Promise<void> {
  res.json(await getVisibleClientLogos());
}

export async function getClientLogosAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllClientLogos());
}

export async function createClientLogoHandler(req: Request, res: Response): Promise<void> {
  const { name, industry, logo_url, visible, display_order } = req.body as Record<string, unknown>;
  if (!name || typeof name !== 'string') { res.status(400).json({ error: 'name required' }); return; }
  const result = await createClientLogo({
    name,
    industry: (industry as string) ?? null,
    logo_url: (logo_url as string) ?? null,
    visible: visible !== false,
    display_order: Number(display_order) || 0,
  }) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateClientLogoHandler(req: Request, res: Response): Promise<void> {
  await updateClientLogo(Number(req.params.id), req.body as Record<string, unknown>);
  res.json({ ok: true });
}

export async function deleteClientLogoHandler(req: Request, res: Response): Promise<void> {
  await deleteClientLogo(Number(req.params.id));
  res.json({ ok: true });
}

export async function reorderClientLogosHandler(req: Request, res: Response): Promise<void> {
  const { ids } = req.body as { ids: number[] };
  if (!Array.isArray(ids)) { res.status(400).json({ error: 'ids array required' }); return; }
  await reorderClientLogos(ids);
  res.json({ ok: true });
}

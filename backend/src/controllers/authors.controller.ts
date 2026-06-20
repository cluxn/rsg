import { Request, Response } from 'express';
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from '../services/authors.service';

export async function getAuthorsAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllAuthors());
}

export async function createAuthorHandler(req: Request, res: Response): Promise<void> {
  const { name, email, photo_url, role, active, display_order } = req.body as Record<string, unknown>;
  if (!name || typeof name !== 'string') { res.status(400).json({ error: 'name required' }); return; }
  const result = await createAuthor({
    name,
    email: (email as string) ?? null,
    photo_url: (photo_url as string) ?? null,
    role: (role as string) || 'Author',
    active: active !== false,
    display_order: Number(display_order) || 0,
  }) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateAuthorHandler(req: Request, res: Response): Promise<void> {
  await updateAuthor(Number(req.params.id), req.body as Record<string, unknown>);
  res.json({ ok: true });
}

export async function deleteAuthorHandler(req: Request, res: Response): Promise<void> {
  await deleteAuthor(Number(req.params.id));
  res.json({ ok: true });
}

import { Request, Response } from 'express';
import { getCategoriesByType, getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/categories.service';

export async function getCategoriesPublic(req: Request, res: Response): Promise<void> {
  const type = String(req.query.type || 'blog');
  res.json(await getCategoriesByType(type));
}

export async function getAllCategoriesAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllCategories());
}

export async function createCategoryHandler(req: Request, res: Response): Promise<void> {
  const { type, name, slug } = req.body as { type?: string; name?: string; slug?: string };
  if (!name || !slug) { res.status(400).json({ error: 'name and slug required' }); return; }
  const result = await createCategory({ type: type || 'blog', name, slug }) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updateCategoryHandler(req: Request, res: Response): Promise<void> {
  await updateCategory(Number(req.params.id), req.body as { name?: string; slug?: string });
  res.json({ ok: true });
}

export async function deleteCategoryHandler(req: Request, res: Response): Promise<void> {
  await deleteCategory(Number(req.params.id));
  res.json({ ok: true });
}

import { query } from '../db/connection';

export interface Category {
  id: number;
  type: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

export async function getCategoriesByType(type: string): Promise<Category[]> {
  return query('SELECT * FROM categories WHERE type = ? ORDER BY display_order ASC, name ASC', [type]);
}

export async function getAllCategories(): Promise<Category[]> {
  return query('SELECT * FROM categories ORDER BY type ASC, display_order ASC, name ASC');
}

export async function createCategory(data: { type: string; name: string; slug: string }): Promise<{ insertId: number }> {
  const rows = await query<{ insertId: number }>(
    'INSERT INTO categories (type, name, slug) VALUES (?,?,?)',
    [data.type, data.name, data.slug]
  );
  return rows[0];
}

export async function updateCategory(id: number, data: { name?: string; slug?: string }): Promise<void> {
  const fields: string[] = [];
  const params: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug); }

  if (!fields.length) return;
  params.push(id);
  await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteCategory(id: number): Promise<void> {
  await query('DELETE FROM categories WHERE id = ?', [id]);
}

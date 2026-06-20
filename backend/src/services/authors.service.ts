import { query } from '../db/connection';

export interface Author {
  id: number;
  name: string;
  email: string | null;
  photo_url: string | null;
  role: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

export async function getAllAuthors(): Promise<Author[]> {
  return query('SELECT * FROM authors ORDER BY display_order ASC, id ASC');
}

export async function createAuthor(data: Omit<Author, 'id' | 'created_at'>): Promise<{ insertId: number }> {
  const rows = await query<{ insertId: number }>(
    'INSERT INTO authors (name, email, photo_url, role, active, display_order) VALUES (?,?,?,?,?,?)',
    [data.name, data.email ?? null, data.photo_url ?? null, data.role ?? 'Author', data.active ?? true, data.display_order ?? 0]
  );
  return rows[0];
}

export async function updateAuthor(id: number, data: Partial<Omit<Author, 'id' | 'created_at'>>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
  if (data.photo_url !== undefined) { fields.push('photo_url = ?'); params.push(data.photo_url); }
  if (data.role !== undefined) { fields.push('role = ?'); params.push(data.role); }
  if (data.active !== undefined) { fields.push('active = ?'); params.push(data.active); }
  if (data.display_order !== undefined) { fields.push('display_order = ?'); params.push(data.display_order); }

  if (!fields.length) return;
  params.push(id);
  await query(`UPDATE authors SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteAuthor(id: number): Promise<void> {
  await query('DELETE FROM authors WHERE id = ?', [id]);
}

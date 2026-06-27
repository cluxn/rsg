import { query } from '../db/connection';

export interface Redirect {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const listRedirects = () =>
  query<Redirect>('SELECT * FROM redirects ORDER BY created_at DESC');

export const listActiveRedirects = () =>
  query<Pick<Redirect, 'from_path' | 'to_path' | 'status_code'>>(
    'SELECT from_path, to_path, status_code FROM redirects WHERE active = 1'
  );

export const createRedirect = (from_path: string, to_path: string, status_code: number) =>
  query('INSERT INTO redirects (from_path, to_path, status_code) VALUES (?, ?, ?)', [from_path, to_path, status_code]);

export const updateRedirect = (id: number, fields: Partial<Pick<Redirect, 'from_path' | 'to_path' | 'status_code' | 'active'>>) => {
  const sets: string[] = [];
  const vals: (string | number | boolean | null)[] = [];
  if (fields.from_path !== undefined) { sets.push('from_path = ?'); vals.push(fields.from_path); }
  if (fields.to_path !== undefined)   { sets.push('to_path = ?');   vals.push(fields.to_path); }
  if (fields.status_code !== undefined) { sets.push('status_code = ?'); vals.push(fields.status_code); }
  if (fields.active !== undefined)    { sets.push('active = ?');    vals.push(fields.active ? 1 : 0); }
  if (!sets.length) return Promise.resolve();
  vals.push(id);
  return query(`UPDATE redirects SET ${sets.join(', ')} WHERE id = ?`, vals);
};

export const deleteRedirect = (id: number) =>
  query('DELETE FROM redirects WHERE id = ?', [id]);

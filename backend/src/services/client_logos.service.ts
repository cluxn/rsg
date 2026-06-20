import { query } from '../db/connection';

export interface ClientLogo {
  id: number;
  name: string;
  industry: string | null;
  logo_url: string | null;
  visible: boolean;
  display_order: number;
  created_at: string;
}

export async function getAllClientLogos(): Promise<ClientLogo[]> {
  return query('SELECT * FROM client_logos ORDER BY display_order ASC, id ASC');
}

export async function getVisibleClientLogos(): Promise<ClientLogo[]> {
  return query('SELECT * FROM client_logos WHERE visible = TRUE ORDER BY display_order ASC, id ASC');
}

export async function createClientLogo(data: Omit<ClientLogo, 'id' | 'created_at'>): Promise<{ insertId: number }> {
  const rows = await query<{ insertId: number }>(
    'INSERT INTO client_logos (name, industry, logo_url, visible, display_order) VALUES (?,?,?,?,?)',
    [data.name, data.industry ?? null, data.logo_url ?? null, data.visible ?? true, data.display_order ?? 0]
  );
  return rows[0];
}

export async function updateClientLogo(id: number, data: Partial<Omit<ClientLogo, 'id' | 'created_at'>>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
  if (data.industry !== undefined) { fields.push('industry = ?'); params.push(data.industry); }
  if (data.logo_url !== undefined) { fields.push('logo_url = ?'); params.push(data.logo_url); }
  if (data.visible !== undefined) { fields.push('visible = ?'); params.push(data.visible); }
  if (data.display_order !== undefined) { fields.push('display_order = ?'); params.push(data.display_order); }

  if (!fields.length) return;
  params.push(id);
  await query(`UPDATE client_logos SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteClientLogo(id: number): Promise<void> {
  await query('DELETE FROM client_logos WHERE id = ?', [id]);
}

export async function reorderClientLogos(orderedIds: number[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await query('UPDATE client_logos SET display_order = ? WHERE id = ?', [i + 1, orderedIds[i]]);
  }
}

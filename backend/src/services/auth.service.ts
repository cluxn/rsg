import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';

interface AdminRow { id: number; email: string; password_hash: string; role: string; active: boolean; created_at: string; permissions: string | null }

export async function findAdminByEmail(email: string) {
  const rows = await query<AdminRow>('SELECT id, email, password_hash, role, active, permissions FROM admin_users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

export async function findAdminById(id: number) {
  const rows = await query<AdminRow>('SELECT id, email, password_hash, role, active, permissions FROM admin_users WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function listAdminUsers() {
  return query<{ id: number; email: string; role: string; active: boolean; created_at: string; permissions: string | null }>(
    'SELECT id, email, role, active, created_at, permissions FROM admin_users ORDER BY created_at ASC'
  );
}

export async function createAdminUser(email: string, password: string, role = 'super_admin', permissions: string[] | null = null) {
  const hash = await bcrypt.hash(password, 12);
  const perms = permissions ? JSON.stringify(permissions) : null;
  await query('INSERT INTO admin_users (email, password_hash, role, active, permissions) VALUES (?, ?, ?, 1, ?)', [email, hash, role, perms]);
}

export async function deleteAdminUser(id: number) {
  await query('DELETE FROM admin_users WHERE id = ?', [id]);
}

export async function updateAdminUser(id: number, fields: { role?: string; email?: string; permissions?: string[] | null }) {
  if (fields.role !== undefined) await query('UPDATE admin_users SET role = ? WHERE id = ?', [fields.role, id]);
  if (fields.email !== undefined) await query('UPDATE admin_users SET email = ? WHERE id = ?', [fields.email.trim().toLowerCase(), id]);
  if (fields.permissions !== undefined) {
    const perms = fields.permissions ? JSON.stringify(fields.permissions) : null;
    await query('UPDATE admin_users SET permissions = ? WHERE id = ?', [perms, id]);
  }
}

export async function setAdminActive(id: number, active: boolean) {
  await query('UPDATE admin_users SET active = ? WHERE id = ?', [active ? 1 : 0, id]);
}

export async function resetAdminPassword(id: number, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 12);
  await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, id]);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: { id: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export async function updateAdminEmail(id: number, email: string) {
  await query('UPDATE admin_users SET email = ? WHERE id = ?', [email, id]);
}

export async function updateAdminPassword(id: number, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 12);
  await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, id]);
}

export function parsePermissions(raw: string | null | undefined): string[] | null {
  if (raw === null || raw === undefined) return null;
  try { return JSON.parse(raw as string); } catch { return null; }
}

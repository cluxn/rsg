import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';

interface AdminRow { id: number; email: string; password_hash: string; role: string; active: boolean; created_at: string }

export async function findAdminByEmail(email: string) {
  const rows = await query<AdminRow>('SELECT id, email, password_hash, role, active FROM admin_users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

export async function findAdminById(id: number) {
  const rows = await query<AdminRow>('SELECT id, email, password_hash, role, active FROM admin_users WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function listAdminUsers() {
  return query<{ id: number; email: string; role: string; active: boolean; created_at: string }>(
    'SELECT id, email, role, active, created_at FROM admin_users ORDER BY created_at ASC'
  );
}

export async function createAdminUser(email: string, password: string, role = 'super_admin') {
  const hash = await bcrypt.hash(password, 12);
  await query('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, role]);
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

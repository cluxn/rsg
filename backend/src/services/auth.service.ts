import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';

interface AdminRow { id: number; email: string; password_hash: string }

export async function findAdminByEmail(email: string) {
  const rows = await query<AdminRow>('SELECT id, email, password_hash FROM admin_users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: { id: number; email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

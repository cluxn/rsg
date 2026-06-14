import { Request, Response } from 'express';
import { findAdminByEmail, verifyPassword, signToken } from '../services/auth.service';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'email and password required' }); return;
  }
  const admin = await findAdminByEmail(email);
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' }); return;
  }
  const token = signToken({ id: admin.id, email: admin.email });
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ ok: true, admin: { id: admin.id, email: admin.email } });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token');
  res.json({ ok: true });
}

export function me(req: Request, res: Response): void {
  res.json(req.admin);
}

import { Request, Response } from 'express';
import {
  findAdminByEmail, findAdminById, verifyPassword, signToken,
  updateAdminEmail, updateAdminPassword,
  listAdminUsers, createAdminUser, setAdminActive, resetAdminPassword,
} from '../services/auth.service';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'email and password required' }); return;
  }
  const admin = await findAdminByEmail(email);
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' }); return;
  }
  if (!admin.active) {
    res.status(403).json({ error: 'Account is deactivated' }); return;
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

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const adminId = req.admin!.id;
  const { currentPassword, newEmail, newPassword } = req.body as {
    currentPassword?: string; newEmail?: string; newPassword?: string;
  };

  if (!currentPassword) { res.status(400).json({ error: 'Current password is required' }); return; }
  if (!newEmail && !newPassword) { res.status(400).json({ error: 'Provide a new email or new password' }); return; }

  const admin = await findAdminById(adminId);
  if (!admin || !(await verifyPassword(currentPassword, admin.password_hash))) {
    res.status(401).json({ error: 'Current password is incorrect' }); return;
  }

  if (newEmail && typeof newEmail === 'string') {
    const existing = await findAdminByEmail(newEmail);
    if (existing && existing.id !== adminId) { res.status(409).json({ error: 'Email already in use' }); return; }
    await updateAdminEmail(adminId, newEmail.trim().toLowerCase());
  }

  if (newPassword && typeof newPassword === 'string') {
    if (newPassword.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }
    await updateAdminPassword(adminId, newPassword);
  }

  res.json({ ok: true });
}

// ─── User management ──────────────────────────────────────────────────────────

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await listAdminUsers();
  res.json(users);
}

export async function addUser(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body as { email?: string; password?: string; role?: string };
  if (!email || !password) { res.status(400).json({ error: 'email and password required' }); return; }
  if (password.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }

  const existing = await findAdminByEmail(email.trim().toLowerCase());
  if (existing) { res.status(409).json({ error: 'Email already in use' }); return; }

  await createAdminUser(email.trim().toLowerCase(), password, role ?? 'super_admin');
  res.status(201).json({ ok: true });
}

export async function toggleUserStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { active } = req.body as { active: boolean };
  if (id === req.admin!.id) { res.status(400).json({ error: 'Cannot deactivate your own account' }); return; }
  await setAdminActive(id, active);
  res.json({ ok: true });
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { password } = req.body as { password?: string };
  if (!password || password.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }
  await resetAdminPassword(id, password);
  res.json({ ok: true });
}

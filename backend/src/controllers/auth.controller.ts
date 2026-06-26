import { Request, Response } from 'express';
import {
  findAdminByEmail, findAdminById, verifyPassword, signToken,
  updateAdminEmail, updateAdminPassword,
  listAdminUsers, createAdminUser, setAdminActive, resetAdminPassword,
  deleteAdminUser, updateAdminUser, parsePermissions,
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

export async function me(req: Request, res: Response): Promise<void> {
  const admin = await findAdminById(req.admin!.id);
  if (!admin) { res.status(401).json({ error: 'Not found' }); return; }
  res.json({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    permissions: parsePermissions(admin.permissions),
  });
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
  const rows = await listAdminUsers();
  const users = rows.map(u => ({ ...u, permissions: parsePermissions(u.permissions) }));
  res.json(users);
}

export async function addUser(req: Request, res: Response): Promise<void> {
  const { email, password, role, permissions } = req.body as {
    email?: string; password?: string; role?: string; permissions?: string[] | null;
  };
  if (!email || !password) { res.status(400).json({ error: 'email and password required' }); return; }
  if (password.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }

  const existing = await findAdminByEmail(email.trim().toLowerCase());
  if (existing) { res.status(409).json({ error: 'Email already in use' }); return; }

  const resolvedRole = role ?? 'editor';
  const resolvedPerms = resolvedRole === 'super_admin' ? null : (permissions ?? []);
  await createAdminUser(email.trim().toLowerCase(), password, resolvedRole, resolvedPerms);
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

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (id === req.admin!.id) { res.status(400).json({ error: 'Cannot delete your own account' }); return; }
  await deleteAdminUser(id);
  res.json({ ok: true });
}

export async function editUser(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { role, email, permissions } = req.body as { role?: string; email?: string; permissions?: string[] | null };
  if (role === undefined && email === undefined && permissions === undefined) {
    res.status(400).json({ error: 'Nothing to update' }); return;
  }
  if (email) {
    const existing = await findAdminByEmail(email.trim().toLowerCase());
    if (existing && existing.id !== id) { res.status(409).json({ error: 'Email already in use' }); return; }
  }
  const resolvedPerms = role === 'super_admin' ? null : permissions;
  await updateAdminUser(id, { role, email, permissions: resolvedPerms });
  res.json({ ok: true });
}

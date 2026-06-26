import { api } from './api';
import type { Admin } from '@/contexts/AuthContext';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  // after login, fetch full profile (role + permissions)
  const me = await getMe();
  return { ...data, admin: me };
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<Admin> {
  const { data } = await api.get<Admin>('/auth/me');
  return data;
}

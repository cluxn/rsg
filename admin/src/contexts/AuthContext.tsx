'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '@/lib/auth';

export interface Admin { id: number; email: string; role: string; permissions: string[] | null }

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await apiLogin(email, password);
    setAdmin(data.admin);
  }

  async function logout() {
    await apiLogout();
    setAdmin(null);
    window.location.href = '/login';
  }

  function hasPermission(module: string): boolean {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    if (admin.permissions === null) return true;
    return admin.permissions.includes(module);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, logout as apiLogout } from '@/lib/auth';

interface Admin { id: number; email: string }

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  logout: () => Promise<void>;
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

  async function logout() {
    await apiLogout();
    setAdmin(null);
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ admin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

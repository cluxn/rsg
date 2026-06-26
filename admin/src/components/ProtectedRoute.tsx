import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Props { children: React.ReactNode; module?: string }

export function ProtectedRoute({ children, module }: Props) {
  const { admin, loading, hasPermission } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-body text-navy/60">Loading...</p>
      </div>
    );
  }
  if (!admin) return <Navigate to="/login" replace />;
  if (module && !hasPermission(module)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

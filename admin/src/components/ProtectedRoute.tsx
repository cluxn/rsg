import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-body text-navy/60">Loading...</p>
      </div>
    );
  }
  if (!admin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

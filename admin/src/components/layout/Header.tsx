import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { admin, logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-navy/10 flex items-center justify-end px-6 z-10">
      <div className="flex items-center gap-4">
        {admin && (
          <span className="font-body text-sm text-navy/70">{admin.email}</span>
        )}
        <Button variant="ghost" size="sm" onClick={logout} className="text-navy/70 hover:text-navy">
          Logout
        </Button>
      </div>
    </header>
  );
}

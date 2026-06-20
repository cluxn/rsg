import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';

export function Header() {
  const { admin, logout } = useAuth();
  const { collapsed, toggle } = useSidebar();

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-navy/10 flex items-center justify-between px-4 z-10 transition-all duration-200 ${collapsed ? 'left-14' : 'left-56'}`}>
      <button onClick={toggle} className="p-2 rounded-lg text-navy/50 hover:text-navy hover:bg-navy/5 transition-colors" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-4">
        {admin && <span className="font-body text-sm text-navy/70">{admin.email}</span>}
        <Button variant="ghost" size="sm" onClick={logout} className="text-navy/70 hover:text-navy">Logout</Button>
      </div>
    </header>
  );
}

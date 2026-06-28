import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, FileText, Megaphone, Search, Settings2, ChevronsLeft, ChevronsRight, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

const CONTENT_PREFIXES = ['/blog', '/events', '/testimonials', '/media', '/client-logos', '/authors', '/categories'];

const navItems = [
  { label: 'Dashboard', to: '/', exact: true, module: 'dashboard' },
  { label: 'Catalog', to: '/catalog', module: 'catalog' },
  { label: 'Content', to: '/blog', contentGroup: true, module: 'content' },
  { label: 'Leads', to: '/leads', module: 'leads' },
  { label: 'Newsletter', to: '/newsletter', module: 'leads' },
  { label: 'Marketing', to: '/marketing', module: 'marketing' },
  { label: 'SEO', to: '/seo', module: 'seo' },
  { label: 'Settings', to: '/settings', module: 'settings' },
];

const icons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Catalog: Package,
  Content: FileText,
  Leads: Users,
  Newsletter: Mail,
  Marketing: Megaphone,
  SEO: Search,
  Settings: Settings2,
};

export function Sidebar() {
  const location = useLocation();
  const { collapsed, toggle } = useSidebar();
  const { hasPermission } = useAuth();

  const visibleItems = navItems.filter(item => hasPermission(item.module));

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-off-white border-r border-navy/10 flex flex-col transition-all duration-200',
      collapsed ? 'w-14' : 'w-56'
    )}>
      <div className="h-16 flex items-center justify-center border-b border-navy/10 px-3 overflow-hidden">
        {collapsed ? (
          <span className="font-heading text-lg text-navy font-bold">R</span>
        ) : (
          <>
            <img src="/rsg-logo.png" alt="RSG" className="h-10 w-auto" onError={e => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-heading text-xl text-navy font-bold">RSG</span>
          </>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {visibleItems.map(({ label, to, exact, contentGroup }) => {
          const Icon = icons[label];
          const isActive = exact
            ? location.pathname === to
            : contentGroup
              ? CONTENT_PREFIXES.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
              : location.pathname === to || location.pathname.startsWith(to + '/');

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 font-body text-sm transition-colors',
                collapsed ? 'justify-center' : '',
                isActive ? 'bg-steel/10 text-steel font-semibold' : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={toggle}
        title={collapsed ? 'Show sidebar' : 'Hide sidebar'}
        className={cn(
          'flex items-center gap-2 px-3 py-3 border-t border-navy/10 font-body text-sm text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors',
          collapsed ? 'justify-center' : ''
        )}
      >
        {collapsed ? <ChevronsRight className="w-4 h-4 shrink-0" /> : <ChevronsLeft className="w-4 h-4 shrink-0" />}
        {!collapsed && 'Hide sidebar'}
      </button>
    </aside>
  );
}

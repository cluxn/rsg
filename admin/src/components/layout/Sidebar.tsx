import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Megaphone, Search, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONTENT_PREFIXES = ['/blog', '/case-studies', '/testimonials', '/media', '/client-logos', '/authors', '/categories'];

const navItems = [
  { label: 'Dashboard', to: '/', exact: true },
  { label: 'Content', to: '/blog', contentGroup: true },
  { label: 'Leads', to: '/leads' },
  { label: 'Marketing', to: '/marketing' },
  { label: 'SEO', to: '/seo' },
  { label: 'Settings', to: '/settings' },
];

const icons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Content: FileText,
  Leads: Users,
  Marketing: Megaphone,
  SEO: Search,
  Settings: Settings2,
};

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-off-white border-r border-navy/10 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-navy/10">
        <img
          src="/rsg-logo.png"
          alt="RSG Profile Manufacturing"
          className="h-10 w-auto"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="font-heading text-xl text-navy font-bold">RSG</span>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {navItems.map(({ label, to, exact, contentGroup }) => {
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
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 font-body text-sm transition-colors',
                isActive
                  ? 'bg-steel/10 text-steel font-semibold'
                  : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Image, FileText, Calendar, Star, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Leads', to: '/leads', icon: Users },
  { label: 'Catalog', to: '/catalog', icon: Package },
  { label: 'Media Library', to: '/media', icon: Image },
  { label: 'Settings', to: '/settings', icon: Settings2 },
];

const contentNavItems = [
  { label: 'Blog', to: '/blog', icon: FileText },
  { label: 'Events / News', to: '/events', icon: Calendar },
  { label: 'Testimonials', to: '/testimonials', icon: Star },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-off-white border-r border-navy/10 flex flex-col">
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
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 font-body text-sm transition-colors',
                isActive
                  ? 'bg-steel/10 text-steel font-semibold'
                  : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="mt-4 mb-1 px-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Content</div>
        {contentNavItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 font-body text-sm transition-colors',
                isActive
                  ? 'bg-steel/10 text-steel font-semibold'
                  : 'text-navy/70 hover:text-navy hover:bg-navy/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

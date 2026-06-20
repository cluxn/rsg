import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Blog', to: '/blog' },
  { label: 'Events', to: '/events' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Media Library', to: '/media' },
  { label: 'Client Logos', to: '/client-logos' },
  { label: 'Authors', to: '/authors' },
  { label: 'Categories', to: '/categories' },
];

export function ContentTabs() {
  return (
    <div className="border-b border-navy/10 bg-white">
      <div className="flex px-6 overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) => cn(
              'shrink-0 px-4 py-3 font-body text-sm border-b-2 transition-colors -mb-px whitespace-nowrap',
              isActive
                ? 'border-steel text-steel font-semibold'
                : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
            )}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

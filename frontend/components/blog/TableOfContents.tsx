'use client';

import type { TocItem } from '@/lib/toc';

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-body text-xs font-bold text-navy/50 uppercase tracking-widest mb-3">Contents</p>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${item.id}`}
              className="font-body text-sm text-navy/70 hover:text-orange transition-colors leading-snug block py-0.5"
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

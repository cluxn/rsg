'use client';

import { useMemo, useState } from 'react';
import type { EventItem } from '@/lib/content';
import { EventCard } from './EventCard';

const PAGE_SIZE = 12;

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;

  const getPageNums = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', pages];
    if (page >= pages - 3) return [1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, '...', page - 1, page, page + 1, '...', pages];
  };

  const btnBase = 'min-w-[36px] h-9 px-2 rounded-lg font-body text-sm font-semibold transition-colors';
  const btnActive = 'bg-orange text-white shadow-sm';
  const btnIdle = 'text-navy/60 hover:text-navy hover:bg-navy/8';
  const btnDisabled = 'text-navy/25 cursor-not-allowed';

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-navy/10">
      <p className="font-body text-sm text-navy/50">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnIdle}`}
          aria-label="Previous page"
        >
          ←
        </button>
        {getPageNums().map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} className="px-1 text-navy/30 text-sm select-none">…</span>
            : <button
                key={p}
                type="button"
                onClick={() => onChange(p as number)}
                className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
              >
                {p}
              </button>
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className={`${btnBase} ${page === pages ? btnDisabled : btnIdle}`}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function EventGrid({ events }: { events: EventItem[] }) {
  const types = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => { if (e.event_type) set.add(e.event_type); });
    return Array.from(set);
  }, [events]);

  const [active, setActive] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = active === 'All' ? events : events.filter(e => e.event_type === active);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (type: string) => { setActive(type); setPage(1); };

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleFilter('All')}
          className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
            active === 'All' ? 'bg-orange text-white' : 'text-navy/60 hover:text-navy'
          }`}
        >
          All
        </button>
        {types.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => handleFilter(type)}
            className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              active === type ? 'bg-orange text-white' : 'text-navy/60 hover:text-navy'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Type dropdown (mobile-friendly) */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-body text-sm font-semibold text-navy/70 shrink-0">Filter By:</span>
        <select
          value={active}
          onChange={e => handleFilter(e.target.value)}
          className="font-body text-sm text-navy border border-navy/15 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-steel/40 max-w-xs"
        >
          <option value="All">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-navy/50 py-16 text-lg">No events in this category yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(event => <EventCard key={event.id} event={event} />)}
          </div>
          <Pagination page={page} total={filtered.length} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </>
      )}
    </div>
  );
}

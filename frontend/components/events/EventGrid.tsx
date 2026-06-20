'use client';

import { useMemo, useState } from 'react';
import type { EventItem } from '@/lib/content';
import { EventCard } from './EventCard';

export function EventGrid({ events }: { events: EventItem[] }) {
  const types = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => { if (e.event_type) set.add(e.event_type); });
    return Array.from(set);
  }, [events]);

  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? events : events.filter(e => e.event_type === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActive('All')}
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
            onClick={() => setActive(type)}
            className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              active === type ? 'bg-orange text-white' : 'text-navy/60 hover:text-navy'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Type dropdown (mobile-friendly alternative to pills) */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-body text-sm font-semibold text-navy/70 shrink-0">Filter By:</span>
        <select
          value={active}
          onChange={e => setActive(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}

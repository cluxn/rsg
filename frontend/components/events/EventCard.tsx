import Link from 'next/link';
import Image from 'next/image';
import type { EventItem } from '@/lib/content';
import { EVENT_COVER_PLACEHOLDER } from '@/lib/content';

function formatDateRange(start?: string, end?: string) {
  if (!start) return null;
  const startDate = new Date(start);
  const startFmt = startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (!end || end === start) return startFmt;
  const endDate = new Date(end);
  const endFmt = endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startFmt} – ${endFmt}`;
}

function getStatus(start?: string, end?: string): 'Upcoming' | 'Ongoing' | 'Past' | null {
  if (!start) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : startDate;
  if (today < startDate) return 'Upcoming';
  if (today > endDate) return 'Past';
  return 'Ongoing';
}

const STATUS_STYLE: Record<string, string> = {
  Upcoming: 'bg-orange text-white',
  Ongoing: 'bg-green-600 text-white',
  Past: 'bg-navy/40 text-white',
};

export function EventCard({ event }: { event: EventItem }) {
  const dateRange = formatDateRange(event.event_date, event.end_date);
  const status = getStatus(event.event_date, event.end_date);

  return (
    <article className="glow-card rounded-xl overflow-hidden group flex flex-col">
      <Link href={`/events/${event.slug}`} className="relative h-48 overflow-hidden block">
        <Image
          src={event.cover_image || EVENT_COVER_PLACEHOLDER}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {event.event_type && (
            <span className="inline-flex items-center rounded-full bg-navy/90 text-white font-body text-xs font-semibold uppercase tracking-wide px-3 py-1">
              {event.event_type}
            </span>
          )}
          {status && (
            <span className={`inline-flex items-center rounded-full font-body text-xs font-semibold uppercase tracking-wide px-3 py-1 ${STATUS_STYLE[status]}`}>
              {status}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-heading text-lg font-bold text-navy leading-snug mb-2 line-clamp-2">
          <Link href={`/events/${event.slug}`} className="hover:text-orange transition-colors">
            {event.title}
          </Link>
        </h2>
        {(dateRange || event.location) && (
          <p className="font-body text-sm font-semibold text-steel mb-2">
            {dateRange}{dateRange && event.location ? ' · ' : ''}{event.location}
          </p>
        )}
        {event.excerpt && (
          <p className="font-body text-sm text-navy/60 mb-4 flex-1 line-clamp-3">{event.excerpt}</p>
        )}
        <div className="mt-auto pt-4 border-t border-navy/8">
          <Link href={`/events/${event.slug}`} className="font-body text-sm font-semibold text-orange hover:text-navy transition-colors">
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}

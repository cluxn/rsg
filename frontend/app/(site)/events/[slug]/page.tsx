import { getEvent, getEvents, EVENT_COVER_PLACEHOLDER } from '@/lib/content';
import { extractToc } from '@/lib/toc';
import { BlogPostBody } from '@/components/blog/BlogPostBody';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BlogLeadForm } from '@/components/blog/BlogLeadForm';
import { EventCard } from '@/components/events/EventCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rsgprofilesheets.com';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.meta_title ?? `${event.title} | RSG Profile Manufacturing`,
    description: event.meta_description ?? event.excerpt ?? undefined,
    alternates: event.canonical_url ? { canonical: event.canonical_url } : undefined,
    openGraph: event.og_image ? { images: [event.og_image] } : undefined,
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(e => ({ slug: e.slug }));
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return null;
  const startFmt = new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end || end === start) return startFmt;
  const endFmt = new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${startFmt} – ${endFmt}`;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const [event, allEvents] = await Promise.all([getEvent(slug), getEvents()]);
  if (!event) notFound();

  const { html: bodyWithIds, toc } = extractToc(event.body ?? '');
  const dateRange = formatDateRange(event.event_date, event.end_date);
  const eventUrl = `${SITE_URL}/events/${slug}`;

  const recommended = allEvents.filter(e => e.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Dark hero */}
      <div className="bg-gradient-to-br from-navy via-steel to-cyan py-12 px-4">
        <SectionContainer noPadding>
          <Link href="/events" className="text-cyan/80 hover:text-cyan text-sm mb-4 inline-block">← Back to Events</Link>
          {event.event_type && (
            <span className="inline-flex items-center rounded-full bg-white/15 text-white font-body text-xs font-semibold uppercase tracking-wide px-3 py-1 mb-3 mr-2">
              {event.event_type}
            </span>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3 max-w-3xl">{event.title}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm flex-wrap">
            {dateRange && <span>{dateRange}</span>}
            {event.location && <span>· {event.location}</span>}
          </div>
        </SectionContainer>
      </div>

      {/* Cover image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <Image
          src={event.cover_image || EVENT_COVER_PLACEHOLDER}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 3-column content */}
      <SectionContainer className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-8 items-start">

          {/* Left: TOC + Share */}
          <aside className="lg:sticky lg:top-24 self-start space-y-8">
            <TableOfContents items={toc} />
            <ShareButtons url={eventUrl} title={event.title} />
          </aside>

          {/* Center: article body */}
          <article className="min-w-0">
            {event.excerpt && (
              <p className="font-body text-lg text-navy/70 leading-relaxed mb-8 pb-8 border-b border-navy/10">
                {event.excerpt}
              </p>
            )}
            <BlogPostBody html={bodyWithIds} />
          </article>

          {/* Right: lead form */}
          <aside className="lg:sticky lg:top-24 self-start">
            <BlogLeadForm sourcePage={`events/${slug}`} />
          </aside>
        </div>
      </SectionContainer>

      {/* Recommended events */}
      {recommended.length > 0 && (
        <div className="border-t border-navy/10 bg-navy/[0.02]">
          <SectionContainer className="py-12">
            <h2 className="font-heading text-2xl text-navy font-bold mb-6">More Events & News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map(e => <EventCard key={e.slug} event={e} />)}
            </div>
          </SectionContainer>
        </div>
      )}
    </>
  );
}

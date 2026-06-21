import { getEvent, getEvents, EVENT_COVER_PLACEHOLDER } from '@/lib/content';
import { BlogPostBody } from '@/components/blog/BlogPostBody';
import { EventCard } from '@/components/events/EventCard';
import { EventRegistrationForm } from '@/components/events/EventRegistrationForm';
import { RegisterNowButton } from '@/components/events/RegisterNowButton';
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

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const [event, allEvents] = await Promise.all([getEvent(slug), getEvents()]);
  if (!event) notFound();

  const dateRange = formatDateRange(event.event_date, event.end_date);
  const recommended = allEvents.filter(e => e.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="gradient-power py-12 px-4">
        <SectionContainer noPadding>
          <Link href="/events" className="text-cyan/80 hover:text-cyan text-sm mb-4 inline-block">← Back to Events</Link>
          {event.event_type && (
            <span className="inline-flex items-center rounded-full bg-white/15 text-white font-body text-xs font-semibold uppercase tracking-wide px-3 py-1 mb-3 mr-2">
              {event.event_type}
            </span>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3 max-w-3xl">{event.title}</h1>
          {event.excerpt && (
            <p className="font-body text-white/65 text-base max-w-2xl">{event.excerpt}</p>
          )}
        </SectionContainer>
      </div>

      {/* Event metadata bar */}
      {(dateRange || event.location || event.event_type) && (
        <div className="bg-white border-b border-navy/10">
          <SectionContainer noPadding>
            <div className="flex flex-wrap items-center gap-6 py-4">
              {dateRange && (
                <div className="flex items-center gap-2 text-navy/70 font-body text-sm">
                  <span className="text-orange"><CalendarIcon /></span>
                  <span>{dateRange}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2 text-navy/70 font-body text-sm">
                  <span className="text-orange"><LocationIcon /></span>
                  <span>{event.location}</span>
                </div>
              )}
              {event.event_type && (
                <div className="flex items-center gap-2 text-navy/70 font-body text-sm">
                  <span className="text-orange"><TagIcon /></span>
                  <span>{event.event_type}</span>
                </div>
              )}
            </div>
          </SectionContainer>
        </div>
      )}

      {/* Cover image — contained */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-2">
        <div className="relative w-full h-56 md:h-80 overflow-hidden rounded-2xl shadow-md">
          <Image
            src={event.cover_image || EVENT_COVER_PLACEHOLDER}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Main content: article left, registration form right */}
      <SectionContainer className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

          {/* Left: event body */}
          <article className="min-w-0">
            <BlogPostBody html={event.body ?? ''} />
          </article>

          {/* Right: registration form (sticky) */}
          <aside className="lg:sticky lg:top-24 self-start">
            <EventRegistrationForm eventTitle={event.title} eventSlug={slug} />
          </aside>
        </div>
      </SectionContainer>

      {/* Bottom CTA strip */}
      <section className="gradient-power border-t border-white/5">
        <SectionContainer className="py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-body text-xs text-orange uppercase tracking-widest font-semibold mb-1">Don&apos;t Miss Out</p>
              <p className="font-heading text-xl text-white font-bold">{event.title}</p>
              {dateRange && <p className="font-body text-white/55 text-sm mt-0.5">{dateRange}{event.location ? ` · ${event.location}` : ''}</p>}
            </div>
            <RegisterNowButton />
          </div>
        </SectionContainer>
      </section>

      {/* Recommended events */}
      {recommended.length > 0 && (
        <div className="border-t border-navy/10 bg-navy/[0.02]">
          <SectionContainer className="py-12">
            <h2 className="font-heading text-2xl text-navy font-bold mb-6">More Events &amp; News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map(e => <EventCard key={e.slug} event={e} />)}
            </div>
          </SectionContainer>
        </div>
      )}
    </>
  );
}

import { getEvent, getEvents, EVENT_COVER_PLACEHOLDER } from '@/lib/content';
import { getSettings } from '@/lib/api';
import { BlogPostBody } from '@/components/blog/BlogPostBody';
import { BlogLeadForm } from '@/components/blog/BlogLeadForm';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { EventCard } from '@/components/events/EventCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rsgprofilesheets.com';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Event Not Found' };
  const title = event.meta_title ?? `${event.title} | RSG Profile Manufacturing`;
  const description = event.meta_description ?? event.excerpt ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: event.canonical_url ?? `/events/${slug}` },
    openGraph: {
      title,
      description,
      url: `/events/${slug}`,
      type: 'article',
      ...(event.og_image ? { images: [event.og_image] } : {}),
    },
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    return events.map(e => ({ slug: e.slug }));
  } catch {
    return [];
  }
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
  const [event, allEvents, settingsData] = await Promise.all([
    getEvent(slug),
    getEvents(),
    getSettings().catch(() => ({} as Record<string, string>)),
  ]);
  if (!event) notFound();

  const waNumber = ((settingsData as Record<string, string>).whatsapp_number ?? '9918522988').replace(/[^0-9+]/g, '');

  const dateRange = formatDateRange(event.event_date, event.end_date);
  const recommended = allEvents.filter(e => e.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero — consistent with list page: gradient-power, centered, padded */}
      <section className="gradient-power w-full flex items-center justify-center min-h-[300px]">
        <div className="w-full py-16 text-center">
          <SectionContainer noPadding>
            {event.event_type && (
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">{event.event_type}</p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3 max-w-3xl mx-auto">{event.title}</h1>
            {event.excerpt && (
              <p className="font-body text-white/65 text-base max-w-2xl mx-auto">{event.excerpt}</p>
            )}
          </SectionContainer>
        </div>
      </section>

      {/* Event metadata bar */}
      {(dateRange || event.location || event.event_type) && (
        <div className="gradient-mesh-light">
          <SectionContainer noPadding>
            <div className="flex flex-wrap items-center justify-center gap-6 py-4">
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

      {/* Cover image + article body — white background */}
      <div className="gradient-mesh-light">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-2">
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

        {/* 2-column: article + sticky sidebar */}
        <SectionContainer className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            <article className="min-w-0">
              <BlogPostBody html={event.body ?? ''} />
            </article>
            <aside className="lg:sticky lg:top-24 self-start space-y-6">
              <BlogLeadForm sourcePage={`events/${slug}`} />
              <ShareButtons url={`${SITE_URL}/events/${slug}`} title={event.title} />
            </aside>
          </div>
        </SectionContainer>
      </div>

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

      {/* Contact form section — exact homepage section */}
      <ContactFormSection waNumber={waNumber} sourcePage={`events/${slug}`} />
    </>
  );
}

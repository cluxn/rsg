import { getEvents } from '@/lib/content';
import { EventGrid } from '@/components/events/EventGrid';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SimpleHero } from '@/components/ui/SimpleHero';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const defaults = {
    title: 'Events & News | RSG Profile Manufacturing',
    description: 'Latest events, news, and announcements from RSG Profile Manufacturing.',
  };
  try {
    const settings = await getSettings();
    const title = settings['meta_title_/events'] || defaults.title;
    const description = settings['meta_desc_/events'] || defaults.description;
    return {
      title,
      description,
      alternates: { canonical: '/events' },
      openGraph: { title, description, url: '/events', type: 'website' },
    };
  } catch {
    return {
      ...defaults,
      alternates: { canonical: '/events' },
      openGraph: { ...defaults, url: '/events', type: 'website' },
    };
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">RSG UPDATES</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Events & News</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Latest announcements and updates from RSG Profile Manufacturing
          </p>
        </SectionContainer>
      </SimpleHero>
      <SectionContainer className="py-16">
        {events.length === 0 ? (
          <p className="text-center text-navy/50 py-16 text-lg">No events yet — check back soon.</p>
        ) : (
          <EventGrid events={events} />
        )}
      </SectionContainer>
    </>
  );
}

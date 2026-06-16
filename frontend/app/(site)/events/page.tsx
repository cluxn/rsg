import { getEvents } from '@/lib/content';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SimpleHero } from '@/components/ui/SimpleHero';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings['meta_title_/events'] || 'Events & News | RSG Profile Manufacturing',
      description: settings['meta_desc_/events'] || 'Latest events, news, and announcements from RSG Profile Manufacturing.',
    };
  } catch {
    return {
      title: 'Events & News | RSG Profile Manufacturing',
      description: 'Latest events, news, and announcements from RSG Profile Manufacturing.',
    };
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">RSG UPDATES</p>
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
          <div className="space-y-6">
            {events.map(event => (
              <article key={event.id} className="bg-white rounded-2xl shadow-md p-6 border border-steel/10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h2 className="font-heading text-xl font-semibold text-navy">{event.title}</h2>
                  {event.event_date && (
                    <span className="text-sm font-semibold text-steel whitespace-nowrap">
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {event.body && (
                  <div className="text-navy/70 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: event.body }} />
                )}
              </article>
            ))}
          </div>
        )}
      </SectionContainer>
    </>
  );
}

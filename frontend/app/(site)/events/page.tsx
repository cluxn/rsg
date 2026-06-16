import { getEvents } from '@/lib/content';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { GradientHero } from '@/components/ui/GradientHero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & News | RSG Profile Manufacturing',
  description: 'Latest events, news, and announcements from RSG Profile Manufacturing.',
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <GradientHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">RSG UPDATES</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Events & News</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Latest announcements and updates from RSG Profile Manufacturing
          </p>
        </SectionContainer>
      </GradientHero>
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

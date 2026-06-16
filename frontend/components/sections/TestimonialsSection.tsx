import { SectionContainer } from '@/components/layout/SectionContainer';
import { RatingBadge } from './RatingBadge';
import type { Testimonial } from '@/lib/content';

const AGGREGATE_RATINGS = [
  { platform: 'Google', rating: 4.7, reviewCount: 19 },
  { platform: 'IndiaMART', rating: 4.0, reviewCount: 41 },
  { platform: 'Justdial', rating: 4.3, reviewCount: 25 },
];

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const displayed = testimonials.slice(0, 4);
  return (
    <section className="bg-gradient-to-br from-navy/5 via-white to-steel/5 py-20">
      <SectionContainer noPadding>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-3">Trusted by Builders Across India</h2>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto">
            Real reviews from contractors, builders, and manufacturers who rely on RSG products.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {AGGREGATE_RATINGS.map(r => <RatingBadge key={r.platform} {...r} />)}
        </div>
        {displayed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayed.map(t => (
              <blockquote key={t.id} className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <p className="text-navy/80 text-base leading-relaxed italic before:content-['“'] after:content-['”']">
                  {t.text}
                </p>
                <footer className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-semibold text-navy text-sm">{t.author_name}</span>
                    {t.author_city && <span className="text-navy/50 text-sm"> · {t.author_city}</span>}
                  </div>
                  {t.rating && <span className="text-orange font-bold text-sm">{t.rating.toFixed(1)}★</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}

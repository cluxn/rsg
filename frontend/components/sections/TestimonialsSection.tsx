import { SectionContainer } from '@/components/layout/SectionContainer';
import { RatingBadge } from './RatingBadge';
import type { Testimonial } from '@/lib/content';

const AGGREGATE_RATINGS = [
  { platform: 'Google', rating: 4.8, reviewCount: 219 },
  { platform: 'IndiaMART', rating: 4.7, reviewCount: 272 },
  { platform: 'Justdial', rating: 4.9, reviewCount: 184 },
];

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const displayed = testimonials.slice(0, 4);
  return (
    <section className="gradient-mesh-dark py-20">
      <SectionContainer noPadding>
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">Trusted by Builders Across India</h2>
          <p className="font-body text-white/55 text-base max-w-2xl mx-auto">
            Real reviews from contractors, builders, and manufacturers who rely on RSG products.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {AGGREGATE_RATINGS.map(r => <RatingBadge key={r.platform} {...r} />)}
        </div>
        {displayed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayed.map(t => (
              <blockquote key={t.id} className="glow-card-dark rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-body text-white/80 text-base leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-heading font-semibold text-white text-sm">{t.author_name}</span>
                    {t.author_city && <span className="font-body text-white/45 text-sm"> &middot; {t.author_city}</span>}
                  </div>
                  {t.rating && <span className="font-heading text-orange font-bold text-sm">{Number(t.rating).toFixed(1)}&#9733;</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}

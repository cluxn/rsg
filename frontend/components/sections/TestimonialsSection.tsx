import Image from 'next/image';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { RatingBadge } from './RatingBadge';
import type { Testimonial } from '@/lib/content';

const AGGREGATE_RATINGS = [
  { platform: 'Google', rating: 4.8, reviewCount: 219 },
  { platform: 'IndiaMART', rating: 4.7, reviewCount: 272 },
  { platform: 'Justdial', rating: 4.9, reviewCount: 184 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: Math.round(rating) }).map((_, j) => (
        <svg key={j} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayed.map(t => (
              <div key={t.id} className="glow-card-dark rounded-xl p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <svg className="w-7 h-7 text-white/70 shrink-0" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  {t.product_bought && (
                    <span className="font-body text-[10.5px] text-white/70 font-semibold uppercase tracking-wide text-right shrink-0 max-w-[60%] leading-tight">
                      {t.product_bought}
                    </span>
                  )}
                </div>

                {t.rating && <Stars rating={t.rating} />}

                <p className="font-body text-white/80 italic mb-5 leading-relaxed text-base flex-1">&ldquo;{t.text}&rdquo;</p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {t.author_image ? (
                    <Image
                      src={t.author_image}
                      alt={t.author_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="font-heading text-white/60 font-bold text-sm">{t.author_name[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-base text-white font-semibold leading-tight">{t.author_name}</p>
                    {(t.designation || t.company) && (
                      <p className="font-body text-xs text-white/50 mt-0.5">
                        {[t.designation, t.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p className="font-body text-xs text-white/50 mt-0.5">{t.source}{t.author_city ? ` · ${t.author_city}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}

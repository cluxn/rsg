'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Testimonial } from '@/lib/content';

const PAGE_SIZE = 12;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: Math.round(rating) }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsGrid({ testimonials }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const slice = testimonials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {slice.map((t) => (
          <div key={t.id} className="glow-card rounded-xl p-6 flex flex-col">
            <svg className="w-7 h-7 text-orange/30 mb-3" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
            </svg>

            {t.rating && <Stars rating={t.rating} />}

            <p className="font-body text-ink/75 italic mb-4 leading-relaxed text-base flex-1">&ldquo;{t.text}&rdquo;</p>

            {/* Product tag */}
            {t.product_bought && (
              <p className="font-body text-xs text-orange font-semibold uppercase tracking-wide mb-3">
                {t.product_bought}
              </p>
            )}

            {/* Author row */}
            <div className="flex items-center gap-3">
              {t.author_image ? (
                <Image
                  src={t.author_image}
                  alt={t.author_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <span className="font-heading text-navy/50 font-bold text-sm">{t.author_name[0]}</span>
                </div>
              )}
              <div>
                <p className="font-heading text-base text-ink font-semibold leading-tight">{t.author_name}</p>
                {(t.designation || t.company) && (
                  <p className="font-body text-xs text-ink/50 mt-0.5">
                    {[t.designation, t.company].filter(Boolean).join(', ')}
                  </p>
                )}
                <p className="font-body text-xs text-ink/40 mt-0.5">
                  {t.source}{t.author_city ? ` · ${t.author_city}` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-navy/15 font-body text-sm text-ink/60 hover:text-ink hover:border-navy/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`w-9 h-9 rounded-lg font-body text-sm transition-colors ${
                p === page
                  ? 'gradient-sunrise text-white font-semibold shadow-sm'
                  : 'border border-navy/15 text-ink/60 hover:text-ink hover:border-navy/30'
              }`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-navy/15 font-body text-sm text-ink/60 hover:text-ink hover:border-navy/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { TESTIMONIALS, RATINGS, PARTNER_LOGOS } from '@/lib/testimonials-data';

export const metadata: Metadata = {
  title: 'Client Testimonials | RSG Profile Manufacturing',
  description: 'Read what contractors, builders, and traders across Uttar Pradesh say about RSG Profile Manufacturing — ISI-certified roofing sheets and structural steel.',
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">TESTIMONIALS</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">What Our Clients Say</h1>
          <p className="font-body text-lg text-white/80 max-w-xl mx-auto">
            Real feedback from contractors, builders, and traders we&apos;ve delivered for across Uttar Pradesh.
          </p>
        </SectionContainer>
      </SimpleHero>

      {/* Rating badges */}
      <SectionContainer className="bg-white" noPadding>
        <div className="py-14 md:py-16">
          <div className="flex flex-wrap justify-center gap-4">
            {RATINGS.map(r => (
              <div key={r.platform} className="glow-card rounded-xl px-6 py-4 text-center">
                <p className="font-heading text-2xl text-gradient-sunrise font-bold">{r.score}</p>
                <p className="font-body text-sm text-ink/55 mt-1">{r.platform} · {r.count}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Full testimonial grid */}
      <SectionContainer className="gradient-mesh-light">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
          <h2 className="font-heading text-3xl font-bold text-ink mb-3">525+ Satisfied Clients Across UP</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Every review below is from a verified buyer on Google, IndiaMART, or JustDial.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glow-card rounded-xl p-6 flex flex-col">
              <svg className="w-7 h-7 text-orange/30 mb-3" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
              <Stars rating={t.rating} />
              <p className="font-body text-ink/75 italic mb-4 leading-relaxed text-base flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-heading text-base text-ink font-semibold">{t.name}</p>
                <p className="font-body text-sm text-ink/50 mt-1">{t.source}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Partner logos */}
      <SectionContainer className="bg-white">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Brand Partners</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Our Clients &amp; Partners</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Authorized dealer for India&apos;s leading steel brands — delivering premium quality at factory prices.
          </p>
        </div>
        <div className="overflow-hidden" aria-label="Partner logos">
          <div className="marquee-track gap-16 items-center">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-14 w-36 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <Image src={logo.src} alt={logo.alt} width={144} height={56} className="object-contain max-h-14" />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* CTA */}
      <div className="gradient-mesh-dark py-16">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white max-w-2xl leading-snug">
            Join Our Growing Family of Satisfied Contractors &amp; Builders
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}

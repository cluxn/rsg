import type { Metadata } from 'next';
import Image from 'next/image';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { TestimonialsGrid } from '@/components/testimonials/TestimonialsGrid';
import { getTestimonials } from '@/lib/content';
import { RATINGS, PARTNER_LOGOS } from '@/lib/testimonials-data';

export const metadata: Metadata = {
  title: 'Client Testimonials | RSG Profile Manufacturing',
  description: 'Read what contractors, builders, and traders across Uttar Pradesh say about RSG Profile Manufacturing — ISI-certified roofing sheets and structural steel.',
  alternates: { canonical: '/testimonials' },
  openGraph: {
    title: 'Client Testimonials | RSG Profile Manufacturing',
    description: 'Read what contractors, builders, and traders across Uttar Pradesh say about RSG Profile Manufacturing — ISI-certified roofing sheets and structural steel.',
    url: '/testimonials',
    type: 'website',
  },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">TESTIMONIALS</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">What Our Clients Say</h1>
          <p className="font-body text-lg text-white/80 max-w-xl mx-auto">
            Real feedback from contractors, builders, and traders we&apos;ve delivered for across Uttar Pradesh.
          </p>
        </SectionContainer>
      </SimpleHero>

      {/* Rating badges + testimonial grid — single white section */}
      <SectionContainer className="gradient-mesh-light">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
          <h2 className="font-heading text-3xl font-bold text-ink mb-3">525+ Satisfied Clients Across UP</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Every review below is from a verified buyer on Google, IndiaMART, or JustDial.
          </p>
        </div>

        {/* Rating badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {RATINGS.map(r => (
            <div key={r.platform} className="glow-card rounded-xl px-6 py-4 text-center">
              <p className="font-heading text-2xl text-gradient-sunrise font-bold">{r.score}</p>
              <p className="font-body text-sm text-ink/55 mt-1">{r.platform} · {r.count}</p>
            </div>
          ))}
        </div>

        {/* Partner logo marquee */}
        <div className="overflow-hidden py-8 border-t border-b border-navy/8 mb-16" aria-label="Partner logos">
          <div className="marquee-track gap-16 items-center">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-14 w-36 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <Image src={logo.src} alt={logo.alt} width={144} height={56} className="object-contain max-h-14" />
              </div>
            ))}
          </div>
        </div>

        <TestimonialsGrid testimonials={testimonials} />
      </SectionContainer>

      <ContactFormSection sourcePage="testimonials" />
    </>
  );
}

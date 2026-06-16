import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ScrollHero } from '@/components/sections/ScrollHero';
import { StatsSection } from '@/components/sections/StatsSection';
import HomeQuoteForm from './HomeQuoteForm';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings['meta_title_/'] || 'RSG Profile Manufacturing',
      description: settings['meta_desc_/'] || 'Premium quality roofing sheets, structural steel, and building materials manufacturer.',
    };
  } catch {
    return {
      title: 'RSG Profile Manufacturing',
      description: 'Premium quality roofing sheets, structural steel, and building materials manufacturer.',
    };
  }
}

const FEATURED_PRODUCTS = [
  {
    name: 'Colour Coated Roofing Sheet',
    slug: 'colour-coated-roofing-sheet',
    desc: 'ISI-certified PPGL & PPGI roofing in premium brand finishes from JSW, Tata BlueScope, and Jindal.',
    image: '/images/hero/industrial-bg.webp',
  },
  {
    name: 'MS Pipe',
    slug: 'ms-pipe',
    desc: 'Structural MS pipes from APL Apollo, Tata & JSW — trusted for heavy-duty construction needs.',
    image: '/images/hero/protection-bg.webp',
  },
  {
    name: 'Decking Sheet',
    slug: 'decking-sheet',
    desc: 'Composite floor decking engineered for multi-storey commercial and industrial construction.',
    image: '/images/hero/dream-home-bg.webp',
  },
  {
    name: 'C and Z Purlins',
    slug: 'purlins',
    desc: 'Precision-rolled Z & C purlins for industrial roofing systems — lightweight yet exceptionally strong.',
    image: '/images/hero/industrial-bg.webp',
  },
  {
    name: 'Polycarbonate Sheet',
    slug: 'polycarbonate-sheet',
    desc: 'UV-resistant transparent roofing panels that bring natural daylight into any structure.',
    image: '/images/hero/protection-bg.webp',
  },
  {
    name: 'Galvanized Plain Sheets',
    slug: 'galvanized-plain-sheets',
    desc: 'High-quality GI plain sheets for versatile structural, fabrication, and general applications.',
    image: '/images/hero/dream-home-bg.webp',
  },
];

const TESTIMONIALS = [
  { quote: 'Satisfactory service and behaviour.', name: 'Shivkant Dixit', source: 'Google', rating: 5 },
  { quote: 'Extremely professional company with good quality products.', name: 'Arvind Yadav', source: 'Google', rating: 5 },
  { quote: 'Very Nice and Good approaching system in this organisation.', name: 'Vijay Prajapati', source: 'IndiaMART', rating: 4 },
];

const RATINGS = [
  { platform: 'Google', score: '4.7★', count: '19 reviews' },
  { platform: 'IndiaMART', score: '4.0★', count: '43 ratings' },
  { platform: 'Justdial', score: '4.3★', count: '25 reviews' },
];

const PARTNER_LOGOS = [
  { src: '/images/logos/tata-steel.png', alt: 'Tata Steel' },
  { src: '/images/logos/asian-ispat.jpg', alt: 'Asian Colour Coated Ispat' },
  { src: '/images/logos/partner-jsw.png', alt: 'Partner Brand' },
  { src: '/images/logos/partner-kamdhenu.png', alt: 'Partner Brand' },
];

export default async function Home() {
  return (
    <>
      {/* Section 1 — Hero */}
      <ScrollHero />

      {/* Section 2 — Stats bar */}
      <StatsSection />

      {/* Section 3 — Products teaser */}
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">What We Offer</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Our Products</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            From roofing sheets to structural steel — a complete range for construction projects.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.name} className="glow-card rounded-xl overflow-hidden group flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/40" aria-hidden="true" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-lg text-ink font-semibold mb-2">{product.name}</h3>
                <p className="font-body text-sm text-ink/60 mb-4 flex-1">{product.desc}</p>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-orange hover:gap-3 transition-all duration-200"
                >
                  View Product <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Section 4 — Why RSG */}
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Why RSG</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Why Choose RSG?</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Trusted by contractors across UP for quality, speed, and a complete product range.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'shield', title: 'ISI Certified Quality', desc: 'All products manufactured to BIS and ISI standards', badge: 'gradient-sunrise', glow: 'shadow-glow-orange' },
            { icon: 'truck', title: 'Fast Delivery', desc: 'Pan-UP delivery within 2-3 days from our Kanpur facility', badge: 'gradient-sky', glow: 'shadow-glow-cyan' },
            { icon: 'package', title: 'Full Range, One Supplier', desc: '10+ product categories from roofing to structural steel', badge: 'gradient-steel', glow: 'shadow-glow-cyan' },
            { icon: 'award', title: 'Trusted by Leading Brands', desc: 'Preferred supplier to Tata Steel projects and top contractors', badge: 'gradient-sunrise', glow: 'shadow-glow-orange' },
          ].map(item => (
            <div key={item.title} className="glow-card rounded-xl p-6">
              <div className="w-10 h-10 rounded-full border-2 border-orange bg-orange/5 shadow flex items-center justify-center mb-4" aria-hidden="true">
                {item.icon === 'shield' && (
                  <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                )}
                {item.icon === 'truck' && (
                  <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                )}
                {item.icon === 'package' && (
                  <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )}
                {item.icon === 'award' && (
                  <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                )}
              </div>
              <h3 className="font-heading text-ink font-semibold mb-2">{item.title}</h3>
              <p className="font-body text-sm text-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Section 5 — Client logo strip */}
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Trusted By</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Our Clients & Partners</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Working with India's leading steel brands and construction firms.
          </p>
        </div>
        {/* Moving logo marquee */}
        <div className="overflow-hidden" aria-label="Partner logos">
          <div className="marquee-track gap-16 items-center">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-14 w-36 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={144}
                  height={56}
                  className="object-contain max-h-14"
                />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Section 6 — Testimonials */}
      <section>
        <SectionContainer>
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
            <h2 className="font-heading text-3xl text-ink font-bold mb-3">What Our Clients Say</h2>
            <p className="font-body text-ink/60 max-w-xl mx-auto">
              Rated 4.7★ on Google — trusted by contractors and homebuilders across Kanpur.
            </p>
          </div>

          {/* Rating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {RATINGS.map(r => (
              <div key={r.platform} className="glow-card rounded-xl px-6 py-4">
                <p className="font-heading text-xl text-gradient-sunrise font-bold">{r.score}</p>
                <p className="font-body text-sm text-ink/70">{r.platform} · {r.count}</p>
              </div>
            ))}
          </div>

          {/* Review quotes */}
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glow-card rounded-xl p-6">
                <p className="font-body text-ink/90 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-heading text-sm text-ink font-semibold">{t.name}</p>
                    <p className="font-body text-xs text-ink/60">{t.source} · {'★'.repeat(t.rating)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Section 7 — Get Quote form */}
      <section className="bg-white border-t border-ink/8">
        <SectionContainer noPadding className="py-20 lg:py-24">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-4">Get Started Today</p>
              <h2 className="font-heading text-ink text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Get a Free Quote
              </h2>
              <p className="font-body text-ink/60 text-base max-w-md mx-auto">
                Tell us your requirement and we&apos;ll get back within 24 hours.
              </p>
            </div>
            <div className="bg-white border border-navy/10 rounded-2xl shadow-sm p-6 lg:p-8">
              <HomeQuoteForm />
            </div>
            <p className="font-body text-center text-sm text-ink/40 mt-4">
              Or{' '}
              <Link href="/contact" className="text-orange hover:underline">visit our contact page</Link>
              {' '}for more options.
            </p>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}

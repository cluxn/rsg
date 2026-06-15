import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ScrollHero } from '@/components/sections/ScrollHero';

const FEATURED_PRODUCTS = [
  { name: 'Colour Coated Roofing Sheet', desc: 'ISI-certified roofing with DuraGlow coating' },
  { name: 'MS Pipe', desc: 'APL Apollo, Tata & JSW grade structural pipes' },
  { name: 'Decking Sheet', desc: 'Composite floor decking for multi-storey builds' },
  { name: 'Purlins', desc: 'Z & C purlins for industrial roofing systems' },
  { name: 'Polycarbonate Sheet', desc: 'UV-resistant transparent roofing panels' },
  { name: 'Turbo Air Ventilator', desc: 'Wind-driven industrial roof ventilators' },
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

const PARTNER_BRANDS = ['Tata Steel', 'JSW Steel', 'Jindal Steel', 'Apollo Pipes', 'Kamdhenu'];

export default function Home() {
  return (
    <>
      {/* Section 1 — Hero */}
      <ScrollHero />

      {/* Section 2 — Stats bar */}
      <section className="gradient-mesh-light text-navy py-8 border-b border-navy/5">
        <div className="mx-auto max-w-container px-6 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
            <div className="flex items-center gap-3">
              <div className="gradient-sunrise shadow-glow-orange w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-bold text-lg">Founded 2019</p>
                <p className="font-body text-sm text-navy/60">Est. in Kanpur</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-navy/10" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="gradient-sky shadow-glow-cyan w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-bold text-lg">4.7★ Google Rating</p>
                <p className="font-body text-sm text-navy/60">19 verified reviews</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-navy/10" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="gradient-steel shadow-glow-cyan w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-bold text-lg">Kanpur-based Manufacturer</p>
                <p className="font-body text-sm text-navy/60">Pan-UP delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Products teaser */}
      <SectionContainer>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-gradient-sky font-bold mb-3">Our Products</h2>
          <p className="font-body text-navy/60 max-w-2xl mx-auto">
            From roofing sheets to structural steel — a complete range for construction projects
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map(product => (
            <div
              key={product.name}
              className="glow-card rounded-xl p-6"
            >
              <div className="gradient-steel w-10 h-10 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-navy font-semibold mb-1">{product.name}</h3>
              <p className="font-body text-sm text-navy/60">{product.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy bg-transparent text-navy hover:bg-navy/5 border border-navy px-6 py-3 text-base"
          >
            View All Products
          </Link>
        </div>
      </SectionContainer>

      {/* Section 4 — Why RSG */}
      <SectionContainer className="gradient-mesh-light">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-gradient-sky font-bold">Why Choose RSG?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'shield', title: 'ISI Certified Quality', desc: 'All products manufactured to BIS and ISI standards', badge: 'gradient-sunrise', glow: 'shadow-glow-orange' },
            { icon: 'truck', title: 'Fast Delivery', desc: 'Pan-UP delivery within 2-3 days from our Kanpur facility', badge: 'gradient-sky', glow: 'shadow-glow-cyan' },
            { icon: 'package', title: 'Full Range, One Supplier', desc: '10+ product categories from roofing to structural steel', badge: 'gradient-steel', glow: 'shadow-glow-cyan' },
            { icon: 'award', title: 'Trusted by Leading Brands', desc: 'Preferred supplier to Tata Steel projects and top contractors', badge: 'gradient-sunrise', glow: 'shadow-glow-orange' },
          ].map(item => (
            <div key={item.title} className="glow-card rounded-xl p-6">
              <div className={`${item.badge} ${item.glow} w-10 h-10 rounded-lg flex items-center justify-center mb-4`} aria-hidden="true">
                {item.icon === 'shield' && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                )}
                {item.icon === 'truck' && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                )}
                {item.icon === 'package' && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )}
                {item.icon === 'award' && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                )}
              </div>
              <h3 className="font-heading text-navy font-semibold mb-2">{item.title}</h3>
              <p className="font-body text-sm text-navy/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Section 5 — Client logo strip */}
      <SectionContainer>
        <h2 className="font-heading text-2xl text-navy/50 font-normal text-center mb-8">Our Clients & Partners</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {PARTNER_BRANDS.map(brand => (
            <span key={brand} className="font-heading text-lg font-semibold text-navy/40 tracking-wide uppercase transition-colors hover:text-orange">
              {brand}
            </span>
          ))}
        </div>
        {/* TODO Phase 3: replace with actual logo images from ASSET-INVENTORY.md */}
      </SectionContainer>

      {/* Section 6 — Testimonials */}
      <section className="gradient-mesh-dark text-white">
        <SectionContainer>
          <h2 className="font-heading text-3xl text-white font-bold text-center mb-10">What Our Clients Say</h2>

          {/* Rating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {RATINGS.map(r => (
              <GlassCard key={r.platform} padding="px-6 py-4">
                <p className="font-heading text-xl text-gradient-sunrise font-bold">{r.score}</p>
                <p className="font-body text-sm text-white/70">{r.platform} · {r.count}</p>
              </GlassCard>
            ))}
          </div>

          {/* Review quotes */}
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <GlassCard key={t.name}>
                <p className="font-body text-white/90 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-heading text-sm text-white font-semibold">{t.name}</p>
                    <p className="font-body text-xs text-white/60">{t.source} · {'★'.repeat(t.rating)}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionContainer>
      </section>
    </>
  );
}

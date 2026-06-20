import Link from 'next/link';
import type { Metadata } from 'next';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { getTestimonials } from '@/lib/content';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings['meta_title_/about'] || 'About Us | RSG Profile Manufacturing',
      description: settings['meta_desc_/about'] || 'Learn about RSG Profile Manufacturing — founded 2019 in Kanpur. Premium roofing sheets and structural steel.',
    };
  } catch {
    return {
      title: 'About Us | RSG Profile Manufacturing',
      description: 'Learn about RSG Profile Manufacturing — founded 2019 in Kanpur. Premium roofing sheets and structural steel.',
    };
  }
}

const PARTNER_BRANDS = ['Tata Steel', 'JSW Steel', 'Jindal Steel', 'Apollo Pipes', 'Kamdhenu'];

const WHY_US = [
  {
    icon: 'certified',
    title: 'ISI Certified Quality',
    desc: 'Every product manufactured to BIS & ISI standards. Each batch undergoes rigorous testing before dispatch — zero compromise on grade.',
  },
  {
    icon: 'brands',
    title: 'Premium Brand Portfolio',
    desc: 'Authorized dealer for JSW Colouron+, Tata BlueScope Durashine, Jindal Sabrang, and more — factory-direct, no middlemen.',
  },
  {
    icon: 'range',
    title: 'Complete One-Stop Solution',
    desc: '10+ product categories under one roof: colour-coated roofing, MS pipes, structural steel, purlins, decking, polycarbonate — everything your project needs.',
  },
  {
    icon: 'delivery',
    title: 'Pan-UP Fast Delivery',
    desc: 'Dispatch within 24 hours, delivery within 2–3 days to any location across Uttar Pradesh from our Kanpur facility.',
  },
  {
    icon: 'experience',
    title: 'Experienced Team',
    desc: 'Founded in 2019 with a team of qualified managers, engineers, and skilled technicians — built on deep industry expertise.',
  },
  {
    icon: 'pricing',
    title: 'Competitive B2B Pricing',
    desc: 'Factory-direct pricing with transparent quotations — no hidden charges, fair terms for retailers, contractors, and builders.',
  },
];

function WhyIcon({ type }: { type: string }) {
  const cls = 'w-6 h-6 text-white';
  if (type === 'certified') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
  if (type === 'brands') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
  if (type === 'range') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
  if (type === 'delivery') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
  if (type === 'experience') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default async function AboutPage() {
  const [testimonials, settings] = await Promise.all([
    getTestimonials(),
    getSettings().catch(() => ({} as Record<string, string>)),
  ]);
  const waNumber = (settings.whatsapp_number ?? '9918522988').replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${waNumber}`;

  return (
    <>
      {/* SECTION 1 — Hero */}
      <SimpleHero minHeight="min-h-[420px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">About RSG</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-5 leading-tight">
            Built on Integrity,<br className="hidden sm:block" /> Driven by Quality
          </h1>
          <p className="font-body text-lg text-white/75 max-w-2xl mx-auto">
            Since 2019, RSG Profile Manufacturing has been Kanpur&apos;s most trusted B2B partner
            for premium roofing sheets and structural steel.
          </p>
        </SectionContainer>
      </SimpleHero>

      {/* SECTION 2 — About Company (DARK — continues from hero, stat chips + intro) */}
      <section className="gradient-power py-16 border-b border-white/5">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Who We Are</p>
              <h2 className="font-heading text-3xl lg:text-4xl text-white font-bold mb-5 leading-tight">
                Kanpur&apos;s Trusted Roofing &amp; Steel Manufacturer
              </h2>
              <p className="font-body text-white/70 leading-relaxed mb-4">
                RSG Profile Manufacturing Pvt. Ltd. is a Kanpur-based manufacturer and authorized dealer
                specialising in colour-coated roofing sheets, structural steel, purlins, decking, polycarbonate
                sheets, and roofing accessories — serving B2B buyers across Uttar Pradesh since 2019.
              </p>
              <p className="font-body text-white/60 leading-relaxed">
                We combine premium raw materials from India&apos;s top steel brands with rigorous in-house quality
                control to deliver products contractors and builders can rely on — every order, every time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'Est. 2019', label: 'Founded in Kanpur' },
                { value: '10+', label: 'Product Categories' },
                { value: '525+', label: 'Satisfied Clients' },
                { value: '4.8★', label: 'Google Rating' },
              ].map(({ value, label }) => (
                <div key={label} className="glow-card-dark rounded-xl p-5 text-center">
                  <p className="font-heading text-2xl lg:text-3xl font-bold text-gradient-sunrise mb-1">{value}</p>
                  <p className="font-body text-xs text-white/50 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Our Story (LIGHT — first break, detailed history) */}
      <section className="gradient-mesh-light py-24">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Journey</p>
              <h2 className="font-heading text-3xl text-ink font-bold mb-6">Our Story</h2>
              <div className="space-y-4 font-body text-ink/70 leading-relaxed">
                <p>
                  RSG Profile Manufacturing Private Limited was founded in December 2019 at Dada Nagar Industrial
                  Estate, Kanpur — established with a mission to produce colour-coated roofing sheets and
                  structural steel products defined by quality, integrity, and consistent delivery.
                </p>
                <p>
                  From our first year, we have seen sustained growth and strong market acceptance. We expanded
                  our product range from roofing sheets to a full suite of 10+ B2B building material categories —
                  including MS pipes, purlins, decking, polycarbonate sheets, and accessories.
                </p>
                <p>
                  We continuously evaluate our production processes and invest in our team to ensure every
                  customer receives premium-quality output on time — building long-term partnerships with
                  contractors, retailers, and builders across UP.
                </p>
              </div>
            </div>
            <div className="glow-card rounded-xl p-6 shadow-md">
              <h3 className="font-heading text-base text-steel uppercase tracking-widest mb-5">Company Facts</h3>
              <dl className="space-y-0 font-body">
                {[
                  { label: 'Founded', value: 'December 2019' },
                  { label: 'Nature of Business', value: 'Manufacturer & Distributor' },
                  { label: 'Location', value: 'Kanpur, Uttar Pradesh' },
                  { label: 'Products', value: '10+ Categories' },
                  { label: 'Google Rating', value: '4.8★ (219+ reviews)' },
                  { label: 'IndiaMART Rating', value: '4.7★ (272+ ratings)' },
                  { label: 'GST', value: '09AAJCR9402M1ZT' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start border-b border-ink/8 py-3 last:border-0">
                    <dt className="text-ink/50 text-sm">{label}</dt>
                    <dd className="font-semibold text-ink text-sm text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Why Us (DARK — like Why RSG on homepage but deeper) */}
      <section className="gradient-power py-24 md:py-32">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center mb-14">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Why Choose RSG</p>
            <h2 className="font-heading text-3xl lg:text-4xl text-white font-bold mb-4">6 Reasons Contractors Pick RSG</h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              From quality certification to same-week delivery — here&apos;s what sets us apart from other suppliers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map(item => (
              <div key={item.title} className="glow-card-dark rounded-xl p-6 flex gap-4">
                <div className="w-12 h-12 rounded-lg gradient-sunrise flex items-center justify-center flex-shrink-0 shadow-glow-orange">
                  <WhyIcon type={item.icon} />
                </div>
                <div>
                  <h3 className="font-heading text-white font-semibold mb-2">{item.title}</h3>
                  <p className="font-body text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Team Stats (LIGHT) */}
      <StatsSection />

      {/* SECTION 6 — Leadership (DARK) */}
      <section className="gradient-power py-24">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Leadership</p>
            <h2 className="font-heading text-3xl text-white font-bold mb-3">The People Behind RSG</h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              Experienced leaders driving quality, growth, and customer trust every day.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="glow-card-dark rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full gradient-sunrise flex items-center justify-center mb-4 shadow-glow-orange">
                <span className="font-heading text-xl text-white font-bold">SG</span>
              </div>
              <h3 className="font-heading text-xl text-white mb-1">Mr. Shivam Gupta</h3>
              <p className="font-body text-orange text-xs font-semibold uppercase tracking-wider mb-5">
                Chief Executive Officer
              </p>
              <p className="font-body text-white/65 italic text-sm leading-relaxed">
                &ldquo;At RSG Profile Manufacturing, we are committed to building the future of roofing solutions
                with quality, consistency, and customer satisfaction at the core. Our customers&apos; trust is
                our biggest achievement.&rdquo;
              </p>
            </div>
            <div className="glow-card-dark rounded-xl p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full gradient-steel flex items-center justify-center mb-4 shadow-glow-cyan">
                <span className="font-heading text-xl text-white font-bold">RG</span>
              </div>
              <h3 className="font-heading text-xl text-white mb-1">Mr. Raman Kumar Gupta</h3>
              <p className="font-body text-cyan text-xs font-semibold uppercase tracking-wider mb-5">Director</p>
              <p className="font-body text-white/65 italic text-sm leading-relaxed">
                &ldquo;Our mission is to ensure every sheet we produce meets the highest standards of quality.
                We focus on expanding our reach, adopting new technologies, and offering value-driven products
                that contribute to India&apos;s infrastructure growth.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Mission / Vision / Values + Process (LIGHT) */}
      <section className="gradient-mesh-light py-20">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Commitment</p>
            <h2 className="font-heading text-3xl text-ink font-bold mb-4">Mission, Vision &amp; Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Mission</p>
              <p className="font-body text-ink/70">Delivering premium quality building materials that stand the test of time and weather.</p>
            </div>
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Vision</p>
              <p className="font-body text-ink/70">To be UP&apos;s most trusted manufacturer of roofing and structural steel, known for reliability and on-time delivery.</p>
            </div>
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Values</p>
              <p className="font-body text-ink/70">Quality &middot; Integrity &middot; Reliability &middot; Customer First</p>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">How We Work</p>
            <h2 className="font-heading text-3xl text-ink font-bold mb-4">Our Working Process</h2>
            <p className="font-body text-ink/60 max-w-xl mx-auto">From your first enquiry to delivery at your site.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'We work closely with you to understand project requirements, quantities, and specifications.' },
              { step: '02', title: 'Custom Manufacturing', desc: 'Our team manufactures to your exact profile requirements using premium raw materials.' },
              { step: '03', title: 'Quality Control', desc: 'Each batch undergoes rigorous testing before it leaves our Kanpur facility.' },
              { step: '04', title: 'Fast Delivery', desc: 'Reliable delivery within 2–3 days across Uttar Pradesh — direct to your site.' },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-start">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-orange/20 z-0" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full gradient-sunrise flex items-center justify-center mb-5 shadow-glow-orange flex-shrink-0">
                  <span className="font-heading text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-heading text-ink font-semibold text-lg mb-2">{item.title}</h3>
                <p className="font-body text-ink/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Clients & Partners (WHITE) */}
      <SectionContainer className="bg-white border-t-4 border-t-orange">
        <h2 className="font-heading text-2xl text-ink text-center mb-2">Our Clients &amp; Brand Partners</h2>
        <p className="font-body text-ink/55 text-center mb-10">Premium brands we stock and supply</p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {PARTNER_BRANDS.map(brand => (
            <span key={brand} className="font-heading text-sm font-bold text-steel/80 tracking-widest uppercase border border-steel/20 rounded-lg px-4 py-2 bg-steel/5">
              {brand}
            </span>
          ))}
        </div>
        <div className="text-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-8 py-4 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Chat on WhatsApp
          </a>
        </div>
      </SectionContainer>

      {/* SECTION 9 — Testimonials (DARK) */}
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}

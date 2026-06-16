import type { Metadata } from 'next';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
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

export default async function AboutPage() {
  const [testimonials, settings] = await Promise.all([
    getTestimonials(),
    getSettings().catch(() => ({} as Record<string, string>)),
  ]);
  const waNumber = (settings.whatsapp_number ?? '9918522988').replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${waNumber}`;
  return (
    <>
      {/* Section 1 — Hero */}
      <SimpleHero minHeight="min-h-[400px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">ABOUT RSG</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Built on Integrity, Driven by Quality</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Since 2019, RSG Profile Manufacturing has been Kanpur&apos;s trusted partner for premium building materials.
          </p>
        </SectionContainer>
      </SimpleHero>

      {/* Section 2 — Company overview (DARK — continues from dark hero like stats bar on homepage) */}
      <SectionContainer className="gradient-power">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-5 font-body text-white/75">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em]">Our Company</p>
            <h2 className="font-heading text-3xl text-white mb-2">Our Story</h2>
            <p>
              RSG Profile Manufacturing Private Limited is one of the leading makers of roofing sheets in Uttar
              Pradesh, with a diverse selection of profiles to meet every customer requirement. We have built a
              well-equipped manufacturing setup with qualified managers, engineers, and skilled technicians.
            </p>
            <p>
              Founded in December 2019 at Dada Nagar Industrial Estate, Kanpur, RSG Profile Manufacturing Pvt.
              Ltd. was established to produce colour-coated roofing sheets and structural steel products
              characterised by quality, integrity, and teamwork. From our inception, we have seen consistent and
              sustained growth along with widespread market acceptance of our products.
            </p>
            <p>
              We continually evaluate our production processes to ensure our customers receive high-quality
              output — serving contractors, builders, and retailers across Uttar Pradesh with roofing sheets,
              MS pipes, structural steel, decking, purlins, and more.
            </p>
          </div>
          <div className="glow-card-dark rounded-xl p-6">
            <h3 className="font-heading text-base text-cyan/90 uppercase tracking-widest mb-5">Company Facts</h3>
            <dl className="space-y-3 font-body text-white/90">
              {[
                { label: 'Founded', value: 'December 2019' },
                { label: 'Nature of Business', value: 'Manufacturer & Distributor' },
                { label: 'Location', value: 'Kanpur, Uttar Pradesh' },
                { label: 'Products', value: '10+ Categories' },
                { label: 'Google Rating', value: '4.7★ (19 reviews)' },
                { label: 'GST', value: '09AAJCR9402M1ZT' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <dt className="text-white/55 text-sm">{label}</dt>
                  <dd className="font-semibold text-sm text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </SectionContainer>

      {/* Section 3 — Mission / Vision / Values (LIGHT — first light break, like Products on homepage) */}
      <section className="gradient-mesh-light py-16">
        <SectionContainer noPadding>
          <h2 className="font-heading text-3xl text-ink text-center mb-10">Our Commitment</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Mission</p>
              <p className="font-body text-ink/70">
                Delivering premium quality building materials that stand the test of time and weather.
              </p>
            </div>
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Vision</p>
              <p className="font-body text-ink/70">
                To be UP&apos;s most trusted manufacturer of roofing and structural steel products, known for
                reliability and on-time delivery.
              </p>
            </div>
            <div className="glow-card rounded-xl p-6">
              <p className="font-heading text-sm text-orange uppercase tracking-wide mb-2">Values</p>
              <p className="font-body text-ink/70">Quality · Integrity · Reliability · Customer First</p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Section 3b — Our Process (LIGHT — continues light, like Products section) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-container px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="text-center mb-14">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">How We Work</p>
            <h2 className="font-heading text-3xl text-ink font-bold mb-4">Our Working Process</h2>
            <p className="font-body text-ink/60 max-w-xl mx-auto">
              From your first enquiry to delivery at your site — a streamlined process built for B2B buyers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'We work closely with retailers and contractors to understand specific project requirements, quantities, and specifications.' },
              { step: '02', title: 'Custom Manufacturing', desc: 'After planning and estimation, our team manufactures to your exact profile requirements using premium raw materials.' },
              { step: '03', title: 'Quality Control', desc: 'Each batch of roofing sheets and structural products undergoes rigorous testing before it leaves our facility.' },
              { step: '04', title: 'Fast Delivery', desc: 'RSG ensures prompt, reliable delivery to retailers and construction sites — typically within 2–3 days across UP.' },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-start">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-orange/20 -translate-y-0.5 z-0" aria-hidden="true" />
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

      {/* Section 4 — Leadership bios */}
      <SectionContainer className="gradient-power">
        <h2 className="font-heading text-3xl text-white mb-2 text-center">Our Leadership</h2>
        <p className="font-body text-white/55 text-center mb-12">The people behind RSG&apos;s quality and growth</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="glow-card-dark rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full gradient-sunrise flex items-center justify-center mb-4 shadow-glow-orange" aria-hidden="true">
              <span className="font-heading text-xl text-white font-bold">SG</span>
            </div>
            <h3 className="font-heading text-xl text-white mb-1">Mr. Shivam Gupta</h3>
            <p className="font-body text-orange text-xs font-semibold uppercase tracking-wider mb-4">
              Chief Executive Officer
            </p>
            <p className="font-body text-white/65 italic text-sm leading-relaxed">
              &quot;At RSG Profile Manufacturing Pvt. Ltd., we are committed to building the future of roofing
              solutions with quality, consistency, and customer satisfaction at the core. Our customers&apos;
              trust is our biggest achievement.&quot;
            </p>
          </div>
          <div className="glow-card-dark rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full gradient-steel flex items-center justify-center mb-4 shadow-glow-cyan" aria-hidden="true">
              <span className="font-heading text-xl text-white font-bold">RG</span>
            </div>
            <h3 className="font-heading text-xl text-white mb-1">Mr. Raman Kumar Gupta</h3>
            <p className="font-body text-cyan text-xs font-semibold uppercase tracking-wider mb-4">Director</p>
            <p className="font-body text-white/65 italic text-sm leading-relaxed">
              &quot;Our mission is to ensure every sheet we produce meets the highest standards of quality. We focus
              on expanding our reach, adopting new technologies, and offering value-driven products that
              contribute to India&apos;s infrastructure growth.&quot;
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Section 5 — Client logo strip + CTA */}
      <SectionContainer className="bg-white border-t-4 border-t-orange">
        <h2 className="font-heading text-2xl text-ink text-center mb-2">Our Clients &amp; Brand Partners</h2>
        <p className="font-body text-ink/55 text-center mb-10">Premium brands we stock and supply</p>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
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
            className="inline-flex items-center gap-2 justify-center font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange gradient-sunrise text-white shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 border border-transparent px-8 py-4 text-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </SectionContainer>
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}

import Image from 'next/image';
import type { Metadata } from 'next';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { StatsSection } from '@/components/sections/StatsSection';
import { getSettings } from '@/lib/api';
import { getTestimonials } from '@/lib/content';
import { RATINGS, PARTNER_LOGOS } from '@/lib/testimonials-data';
import HomeQuoteForm from '../HomeQuoteForm';

export async function generateMetadata(): Promise<Metadata> {
  const defaults = {
    title: 'About Us | RSG Profile Manufacturing',
    description: 'Learn about RSG Profile Manufacturing — founded 2019 in Kanpur. Premium roofing sheets and structural steel.',
  };
  try {
    const settings = await getSettings();
    const title = settings['meta_title_/about'] || defaults.title;
    const description = settings['meta_desc_/about'] || defaults.description;
    return {
      title,
      description,
      alternates: { canonical: '/about' },
      openGraph: { title, description, url: '/about', type: 'website' },
    };
  } catch {
    return {
      ...defaults,
      alternates: { canonical: '/about' },
      openGraph: { ...defaults, url: '/about', type: 'website' },
    };
  }
}

const WHY_US = [
  {
    icon: 'certified',
    title: 'ISI Certified Quality',
    desc: 'Every product manufactured to BIS & ISI standards. Each batch undergoes rigorous testing before dispatch — zero compromise on grade.',
    img: 'https://images.pexels.com/photos/32845674/pexels-photo-32845674.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    icon: 'brands',
    title: 'Premium Brand Portfolio',
    desc: 'Authorized dealer for JSW Colouron+, Tata BlueScope Durashine, Jindal Sabrang, and more — factory-direct, no middlemen.',
    img: 'https://images.pexels.com/photos/8940223/pexels-photo-8940223.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    icon: 'range',
    title: 'Complete One-Stop Solution',
    desc: '10+ product categories under one roof: colour-coated roofing, MS pipes, structural steel, purlins, decking, polycarbonate — everything your project needs.',
    img: 'https://images.pexels.com/photos/19784084/pexels-photo-19784084.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    icon: 'delivery',
    title: 'Pan-UP Fast Delivery',
    desc: 'Dispatch within 24 hours, delivery within 2–3 days to any location across Uttar Pradesh from our Kanpur facility.',
    img: 'https://images.pexels.com/photos/18468447/pexels-photo-18468447.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    icon: 'experience',
    title: 'Experienced Team',
    desc: 'Founded in 2019 with a team of qualified managers, engineers, and skilled technicians — built on deep industry expertise.',
    img: 'https://images.pexels.com/photos/32845690/pexels-photo-32845690.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    icon: 'pricing',
    title: 'Competitive B2B Pricing',
    desc: 'Factory-direct pricing with transparent quotations — no hidden charges, fair terms for retailers, contractors, and builders.',
    img: 'https://images.pexels.com/photos/6285089/pexels-photo-6285089.jpeg?auto=compress&cs=tinysrgb&w=400',
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
  const settings = await getSettings().catch(() => ({} as Record<string, string>));
  const waNumber = (settings.whatsapp_number ?? '9918522988').replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${waNumber}`;
  const testimonials = await getTestimonials('about');

  return (
    <>
      {/* SECTION 1 — Hero */}
      <SimpleHero minHeight="min-h-[420px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">About RSG</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-5 leading-tight">
            Built on Integrity,<br className="hidden sm:block" /> Driven by Quality
          </h1>
          <p className="font-body text-lg text-white/75 max-w-2xl mx-auto">
            Since 2019, RSG Profile Manufacturing has been Kanpur&apos;s most trusted B2B partner
            for premium roofing sheets and structural steel.
          </p>
        </SectionContainer>
      </SimpleHero>

      {/* SECTION 2 — About Company + SECTION 3 — Our Story: merged into one shared light background to avoid the seam between the two stacked light sections */}
      <div className="gradient-mesh-light">
      <section className="py-16">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Who We Are</p>
              <h2 className="font-heading text-3xl lg:text-4xl text-navy font-bold mb-5 leading-tight">
                Kanpur&apos;s Trusted Roofing &amp; Steel Manufacturer
              </h2>
              <p className="font-body text-navy/70 leading-relaxed mb-4">
                RSG Profile Manufacturing Pvt. Ltd. is a Kanpur-based manufacturer and authorized dealer
                specialising in colour-coated roofing sheets, structural steel, purlins, decking, polycarbonate
                sheets, and roofing accessories — serving B2B buyers across Uttar Pradesh since 2019.
              </p>
              <p className="font-body text-navy/60 leading-relaxed">
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
                <div key={label} className="glow-card rounded-xl p-5 text-center">
                  <p className="font-heading text-2xl lg:text-3xl font-bold text-gradient-sunrise mb-1">{value}</p>
                  <p className="font-body text-xs text-navy/50 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Our Story */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Journey</p>
              <h2 className="font-heading text-3xl text-navy font-bold mb-6">Our Story</h2>
              <div className="space-y-4 font-body text-navy/70 leading-relaxed">
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
                  <div key={label} className="flex justify-between items-start border-b border-navy/8 py-3 last:border-0">
                    <dt className="text-navy/50 text-sm">{label}</dt>
                    <dd className="font-semibold text-navy text-sm text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* SECTION 4 — Why Us + SECTION 5 (StatsSection) + SECTION 6 — Leadership: merged into one shared dark background to avoid seams between three stacked dark sections */}
      <div className="gradient-power">
      <section className="py-28 md:py-40">
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
              <div key={item.title} className="glow-card-dark rounded-xl overflow-hidden flex flex-col">
                {/* Card image */}
                <div className="relative w-full h-36">
                  <Image src={item.img} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 90vw, 33vw" />
                  <div className="absolute inset-0 bg-navy/50" />
                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg gradient-sunrise flex items-center justify-center shadow-glow-orange">
                    <WhyIcon type={item.icon} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-white font-semibold mb-2">{item.title}</h3>
                  <p className="font-body text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Team Stats */}
      <StatsSection transparentBg />

      {/* SECTION 6 — Leadership */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center mb-16">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Leadership</p>
            <h2 className="font-heading text-3xl lg:text-4xl text-white font-bold mb-3">The People Behind RSG</h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              Experienced leaders driving quality, growth, and customer trust every day.
            </p>
          </div>

          {/* CEO — photo left, quote right */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto bg-navy/40">
                <Image
                  src="/images/team/shivam-gupta.jpg"
                  alt="Mr. Shivam Gupta — CEO, RSG Profile Manufacturing"
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full gradient-sunrise opacity-20 blur-2xl pointer-events-none" />
            </div>
            <div>
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-2">From the CEO&apos;s Desk</p>
              <h3 className="font-heading text-2xl lg:text-3xl text-white font-bold mb-1">Mr. Shivam Gupta</h3>
              <p className="font-body text-orange/80 text-xs font-semibold uppercase tracking-widest mb-6">Chief Executive Officer</p>
              <blockquote className="border-l-4 border-orange pl-5">
                <p className="font-body text-white/75 leading-relaxed italic text-base lg:text-lg">
                  &ldquo;At RSG Profile Manufacturing, we are committed to building the future of roofing solutions
                  with quality, consistency, and customer satisfaction at the core. Our vision is to create reliable
                  and durable roofing products that stand the test of time. We believe in innovation, integrity,
                  and continuous improvement to serve our clients better across India. Our customers&apos; trust is
                  our biggest achievement.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-20" />

          {/* Director — quote left, photo right */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-2">Message from Our Directors</p>
              <h3 className="font-heading text-2xl lg:text-3xl text-white font-bold mb-1">Mr. Raman Kumar Gupta</h3>
              <p className="font-body text-orange/80 text-xs font-semibold uppercase tracking-widest mb-6">Director</p>
              <blockquote className="border-l-4 border-cyan pl-5">
                <p className="font-body text-white/75 leading-relaxed italic text-base lg:text-lg">
                  &ldquo;Our mission is to ensure every sheet we produce meets the highest standards of quality.
                  With our modern manufacturing setup and dedicated workforce, we aim to deliver top-notch solutions
                  in roofing, structural, and fabrication products. We focus on expanding our reach, adopting new
                  technologies, and offering value-driven products that contribute to India&apos;s infrastructure
                  growth.&rdquo;
                </p>
              </blockquote>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto bg-navy/40">
                <Image
                  src="/images/team/raman-gupta.jpg"
                  alt="Mr. Raman Kumar Gupta — Director, RSG Profile Manufacturing"
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full gradient-steel opacity-20 blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-16" />

          {/* Manager's Perspective — full-width quote */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-sm text-white/40 font-semibold uppercase tracking-[0.18em] mb-3">Manager&apos;s Perspective</p>
            <div className="glow-card-dark rounded-2xl p-8 lg:p-10">
              <svg className="w-10 h-10 text-orange/40 mx-auto mb-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-body text-white/75 leading-relaxed italic text-base lg:text-lg mb-6">
                Being on the ground and managing operations closely, I take pride in our efficient workflow and
                committed team. At RSG, we don&apos;t just manufacture sheets — we build trust, provide timely
                services, and address the specific needs of each customer. Our factory environment promotes safety,
                skill development, and productivity. Our goal is to keep growing while staying grounded in quality
                and service excellence.
              </p>
              <div>
                <p className="font-heading text-white font-semibold">Operations Manager</p>
                <p className="font-body text-white/40 text-sm">RSG Profile Manufacturing Pvt. Ltd.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
      </div>

      {/* SECTION 7 — Mission/Vision/Values + SECTION 8 — Brand Partners: merged into one shared light background to avoid the seam between the two stacked light sections */}
      <div className="gradient-mesh-light">
      <section className="py-28 md:py-40">
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
              { step: '01', title: 'Consultation', desc: 'We work closely with you to understand project requirements, quantities, and specifications.', img: 'https://images.pexels.com/photos/3862135/pexels-photo-3862135.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { step: '02', title: 'Custom Manufacturing', desc: 'Our team manufactures to your exact profile requirements using premium raw materials.', img: 'https://images.pexels.com/photos/29842696/pexels-photo-29842696.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { step: '03', title: 'Quality Control', desc: 'Each batch undergoes rigorous testing before it leaves our Kanpur facility.', img: 'https://images.pexels.com/photos/32845674/pexels-photo-32845674.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { step: '04', title: 'Fast Delivery', desc: 'Reliable delivery within 2–3 days across Uttar Pradesh — direct to your site.', img: 'https://images.pexels.com/photos/37848366/pexels-photo-37848366.jpeg?auto=compress&cs=tinysrgb&w=600' },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-orange/20 z-0" aria-hidden="true" />
                )}
                {/* Step image */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5 shadow-sm">
                  <Image src={item.img} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 90vw, 25vw" />
                  <div className="absolute inset-0 bg-navy/30" />
                  <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full gradient-sunrise flex items-center justify-center shadow-glow-orange">
                    <span className="font-heading text-white font-bold text-xs">{item.step}</span>
                  </div>
                </div>
                <h3 className="font-heading text-ink font-semibold text-lg mb-2">{item.title}</h3>
                <p className="font-body text-ink/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Brand Partners (marquee, matches homepage) */}
      <SectionContainer>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Brand Partners</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Our Clients &amp; Partners</h2>
          <p className="font-body text-ink/60">
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
      </div>

      {/* SECTION 9 — Testimonials (DARK, matches homepage style) */}
      <section className="gradient-mesh-dark py-28 md:py-40">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
            <h2 className="font-heading text-3xl lg:text-4xl text-white font-bold mb-4">What Our Clients Say</h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              Rated 4.8★ on Google — trusted by contractors and builders across Uttar Pradesh.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {RATINGS.map(r => (
              <div key={r.platform} className="glow-card-dark rounded-xl px-6 py-4 text-center">
                <p className="font-heading text-2xl text-gradient-sunrise font-bold">{r.score}</p>
                <p className="font-body text-sm text-white/55 mt-1">{r.platform} · {r.count}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="overflow-hidden px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
        >
          <div className="marquee-track gap-6" style={{ animationDuration: '120s' }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={`${t.id}-${i}`} className="glow-card-dark rounded-xl p-6 w-80 flex-shrink-0 flex flex-col">
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

                {t.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: Math.round(t.rating) }).map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

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
        </div>
      </section>

      {/* SECTION 10 — Get a Quote (matches homepage panel) */}
      <section className="gradient-mesh-light py-24 md:py-32">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col gap-6 py-4">
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em]">Get A Quote</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-snug">
                Get Premium Roofing &amp; Steel at Factory-Direct Wholesale Prices — Across UP.
              </h2>
              <p className="font-heading text-sm font-bold text-ink/70 tracking-widest uppercase">
                Roofing Sheets &nbsp;|&nbsp; Structural Steel &nbsp;|&nbsp; Accessories
              </p>
              <p className="font-body text-ink/65 text-base leading-relaxed">
                Source ISI-certified roofing sheets, MS pipes, purlins, and structural steel directly from our Kanpur
                manufacturing facility. We supply contractors, builders, and traders across Uttar Pradesh at trade
                pricing — with delivery in 2–3 days.
              </p>
              <div className="rounded-xl overflow-hidden border border-navy/10 shadow-sm flex-1 min-h-[220px]">
                <iframe
                  src="https://maps.google.com/maps?q=RSG+Profile+Manufacturing+Pvt+Ltd,+Dada+Nagar+Industrial+Estate,+Kanpur&output=embed"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="RSG Profile Manufacturing — Kanpur facility"
                  className="block w-full h-full min-h-[220px]"
                />
              </div>
              <div>
                <a
                  href={`https://wa.me/${waNumber}?text=Hi%2C%20I%20would%20like%20to%20get%20a%20bulk%20quote%20for%20roofing%20and%20steel%20materials.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div className="bg-white/70 border border-navy/10 rounded-2xl shadow-md p-6 lg:p-8">
              <p className="font-heading text-base font-bold text-ink mb-5">Send an Enquiry</p>
              <HomeQuoteForm sourcePage="about" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

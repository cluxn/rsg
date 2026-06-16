import Link from 'next/link';
import type { Metadata } from 'next';
import { GradientHero } from '@/components/ui/GradientHero';
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
  const testimonials = await getTestimonials();
  return (
    <>
      {/* Section 1 — Hero (gradient-only, no photo per D-03) */}
      <GradientHero minHeight="min-h-[400px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">ABOUT RSG</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Built on Integrity, Driven by Quality</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Since 2019, RSG Profile Manufacturing has been Kanpur&apos;s trusted partner for premium building materials.
          </p>
        </SectionContainer>
      </GradientHero>

      {/* Section 2 — Company overview */}
      <SectionContainer>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-5 font-body text-navy/80">
            <h2 className="font-heading text-3xl text-navy mb-2">Our Story</h2>
            <p>
              RSG Profile Manufacturing Private Limited is one of the top makers of roofing sheets, with a
              selection of profiles to meet customer needs. To satisfy the various demands of the industry, we
              have built a well-equipped manufacturing setup of qualified managers, engineers, and technicians.
            </p>
            <p>
              Founded in December 2019 at Dada Nagar Industrial Estate, Kanpur, RSG Profile Manufacturing Pvt.
              Ltd. was established to produce colour-coated roofing sheets and structural steel products
              characterised by quality, integrity, teamwork, and experience. From our inception, we have seen
              consistent and sustained growth along with widespread market acceptance of our products.
            </p>
            <p>
              We continually evaluate our production processes and our products to ensure we provide our
              customers with high-quality output — serving contractors and builders across Uttar Pradesh with
              roofing sheets, MS pipes, structural steel, and more.
            </p>
          </div>
          <div className="bg-navy text-white rounded-xl p-6">
            <h3 className="font-heading text-lg text-cyan/90 uppercase tracking-wide mb-4">Key Facts</h3>
            <dl className="space-y-3 font-body text-white/90">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/60">Founded</dt>
                <dd className="font-semibold">2019</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/60">Nature of Business</dt>
                <dd className="font-semibold">Manufacturer</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/60">Location</dt>
                <dd className="font-semibold">Kanpur, Uttar Pradesh</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/60">Employees</dt>
                <dd className="font-semibold">11-25</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">GST</dt>
                <dd className="font-semibold">09AAJCR9402M1ZT</dd>
              </div>
            </dl>
          </div>
        </div>
      </SectionContainer>

      {/* Section 3 — Mission / Vision / Values */}
      <section className="gradient-premium py-16">
        <SectionContainer noPadding>
          <h2 className="font-heading text-3xl text-white text-center mb-10">Our Commitment</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard>
              <p className="font-heading text-sm text-cyan/90 uppercase tracking-wide mb-2">Mission</p>
              <p className="font-body text-white/90">
                Delivering premium quality building materials that stand the test of time and weather.
              </p>
            </GlassCard>
            <GlassCard>
              <p className="font-heading text-sm text-cyan/90 uppercase tracking-wide mb-2">Vision</p>
              <p className="font-body text-white/90">
                To be UP&apos;s most trusted manufacturer of roofing and structural steel products, known for
                reliability and on-time delivery.
              </p>
            </GlassCard>
            <GlassCard>
              <p className="font-heading text-sm text-cyan/90 uppercase tracking-wide mb-2">Values</p>
              <p className="font-body text-white/90">Quality · Integrity · Reliability · Customer First</p>
            </GlassCard>
          </div>
        </SectionContainer>
      </section>

      {/* Section 4 — Leadership bios */}
      <SectionContainer>
        <h2 className="font-heading text-3xl text-navy mb-10">Our Leadership</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center mb-4" aria-hidden="true">
              <span className="font-heading text-2xl text-white">SG</span>
            </div>
            <h3 className="font-heading text-2xl text-navy">Mr. Shivam Gupta</h3>
            <p className="font-body text-orange text-sm font-semibold uppercase tracking-wide mb-4">
              Chief Executive Officer
            </p>
            <p className="font-body text-navy/70 italic">
              &quot;At RSG Profile Manufacturing Pvt. Ltd., we are committed to building the future of roofing
              solutions with quality, consistency, and customer satisfaction at the core. Our vision is to
              create reliable and durable roofing products that stand the test of time. We believe in
              innovation, integrity, and continuous improvement to serve our clients better across India. Our
              customers&apos; trust is our biggest achievement.&quot;
            </p>
          </div>
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center mb-4" aria-hidden="true">
              <span className="font-heading text-2xl text-white">RG</span>
            </div>
            <h3 className="font-heading text-2xl text-navy">Mr. Raman Kumar Gupta</h3>
            <p className="font-body text-orange text-sm font-semibold uppercase tracking-wide mb-4">Director</p>
            <p className="font-body text-navy/70 italic">
              &quot;Our mission is to ensure every sheet we produce meets the highest standards of quality. With
              our modern manufacturing setup and dedicated workforce, we aim to deliver top-notch solutions in
              roofing, structural, and fabrication products. We focus on expanding our reach, adopting new
              technologies, and offering value-driven products that contribute to India&apos;s infrastructure
              growth.&quot;
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Section 5 — Client logo strip + CTA */}
      <SectionContainer className="gradient-mesh-light">
        <h2 className="font-heading text-2xl text-navy/70 text-center mb-8">Our Clients &amp; Partners</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {PARTNER_BRANDS.map(brand => (
            <span key={brand} className="font-heading text-lg font-semibold text-navy/50 tracking-wide uppercase">
              {brand}
            </span>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange gradient-sunrise text-white shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 border border-transparent px-8 py-4 text-lg"
          >
            Get in Touch
          </Link>
        </div>
      </SectionContainer>
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}

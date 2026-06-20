import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct, getProducts } from '@/lib/api';
import { ProductPageHero } from '@/components/ui/ProductPageHero';
import { StatsSection } from '@/components/sections/StatsSection';
import { SpecsTable } from '@/components/ui/SpecsTable';
import { SectionContainer } from '@/components/layout/SectionContainer';
import HomeQuoteForm from '@/app/(site)/HomeQuoteForm';

// Fallback to homepage product card images when CMS has no media uploaded
const PRODUCT_CARD_IMAGE: Record<string, string> = {
  'colour-coated-roofing-sheet': '/images/products/colour-coated-roofing-sheet-new.png',
  'decking-sheet':               '/images/products/decking-sheet.png',
  'galvanized-plain-sheets':     '/images/products/galvanized-plain-sheets.png',
  'purlins':                     '/images/products/purlins.png',
  'crimping-sheet':              '/images/products/crimping-sheet-new.png',
  'ms-plate-channel-angle':      '/images/products/ms-plate-channel-angle.png',
  'polycarbonate-sheet':         '/images/products/polycarbonate-sheet.png',
  'ms-pipe':                     '/images/products/ms-pipe.png',
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | RSG Profile Manufacturing`,
    description: product.description?.slice(0, 155) ?? `${product.name} - RSG Profile Manufacturing Pvt. Ltd.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const primaryMedia = product.media[0] ?? null;
  const additionalMedia = product.media.slice(1);
  const cardImageUrl = PRODUCT_CARD_IMAGE[product.slug] ?? null;
  const displayImageUrl = primaryMedia?.url ?? cardImageUrl;

  return (
    <>
      <ProductPageHero product={product} />

      <StatsSection />

      {/* Two-column section with section heading above */}
      <SectionContainer>
        {/* Section heading */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
            Manufacturer &amp; Wholesale Supplier
          </p>
          <h2 className="font-heading text-navy text-2xl sm:text-3xl font-bold leading-tight mb-4 max-w-2xl mx-auto">
            {product.name} — Factory-Direct Wholesale Supply from Kanpur
          </h2>
          <p className="font-body text-navy/60 text-base leading-relaxed max-w-xl mx-auto">
            ISI-certified {product.name.toLowerCase()} supplied directly from our Kanpur factory —
            wholesale pricing for contractors, builders, and industrial buyers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: image — stretches to match right column height */}
          <div className="flex flex-col">
            {displayImageUrl ? (
              <div className="relative flex-1 min-h-[360px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={displayImageUrl}
                  alt={primaryMedia?.alt_text ?? product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative flex-1 min-h-[360px] rounded-2xl bg-steel/10 flex items-center justify-center">
                <span className="font-body text-navy/30 text-sm">No image yet</span>
              </div>
            )}
            {additionalMedia.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {additionalMedia.map((m) => (
                  <div key={m.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-navy/10 hidden lg:block shrink-0">
                    <Image src={m.url} alt={m.alt_text} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: product name + description + specs + CTA */}
          <div className="flex flex-col justify-center py-4">
            <h3 className="font-heading text-orange text-xl font-bold mb-4">
              {product.name}
            </h3>
            {product.description && (
              <p className="font-body text-navy/80 text-base lg:text-[17px] leading-relaxed mb-6">
                {product.description}
              </p>
            )}
            {product.specs && product.specs.length > 0 && (
              <dl className="space-y-2 mb-8 border-t border-navy/10 pt-5">
                {product.specs.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <dt className="font-heading text-navy font-semibold min-w-[140px]">{s.label}:</dt>
                    <dd className="font-body text-navy/70">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <a
              href="#get-quote-section"
              className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-8 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200 w-auto self-start"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </SectionContainer>

      <div id="specs-section">
        <SpecsTable specs={product.specs} />
      </div>

      {/* Why Choose RSG */}
      <SectionContainer className="bg-steel/5 border-y border-navy/8">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Why RSG</p>
          <h2 className="font-heading text-3xl text-navy font-bold mb-3">Why Choose RSG for {product.name}?</h2>
          <p className="font-body text-navy/60 max-w-xl mx-auto">
            What sets us apart as a manufacturer and wholesale supplier you can rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.title} className="glow-card rounded-xl overflow-hidden flex flex-col">
              <div className="relative h-36 overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-navy text-base font-bold mb-2">{item.title}</h3>
                <p className="font-body text-navy/60 text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Key Benefits */}
      <SectionContainer className="bg-white">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Key Benefits</p>
          <h2 className="font-heading text-3xl text-navy font-bold mb-3">Benefits of {product.name}</h2>
          <p className="font-body text-navy/60 max-w-xl mx-auto">
            Built for performance, durability, and ease of use on real construction sites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {productBenefits(product.name).map((b) => (
            <div key={b.title} className="rounded-xl overflow-hidden border border-navy/8 shadow-sm flex flex-col">
              <div className="relative h-36 overflow-hidden">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h4 className="font-heading text-navy text-base font-bold mb-2">{b.title}</h4>
                <p className="font-body text-navy/60 text-sm leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* CTA Banner */}
      <div className="bg-[#f0ebe0] border-b border-[#ddd4be] py-12">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-navy max-w-2xl leading-snug">
            Trusted Manufacturer &amp; Wholesale Supplier of {product.name} in Kanpur, India
          </h2>
          <p className="font-body text-navy/60 text-sm max-w-md">
            Get factory-direct pricing and bulk availability for your next project.
          </p>
          <a
            href="#product-hero-form"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Free Quote
          </a>
        </div>
      </div>

      {/* Manufacturing process */}
      <SectionContainer className="bg-white">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">From Raw Steel to Your Site</p>
          <h2 className="font-heading text-3xl text-navy font-bold mb-3">Our Manufacturing Process</h2>
          <p className="font-body text-navy/60 max-w-xl mx-auto">
            Every step, from sourcing to dispatch, built around consistency and quality control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MANUFACTURING_STEPS.map((step, i) => (
            <div key={step.title} className="glow-card rounded-xl overflow-hidden flex flex-col">
              <div className="relative h-36 overflow-hidden">
                <Image src={step.image} alt={step.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-orange text-white font-heading text-xs font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-navy text-base font-bold mb-2">{step.title}</h3>
                <p className="font-body text-navy/60 text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* FAQs */}
      <SectionContainer className="bg-steel/5 border-y border-navy/8">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Got Questions?</p>
          <h2 className="font-heading text-3xl text-navy font-bold mb-3">Frequently Asked Questions</h2>
          <p className="font-body text-navy/60 max-w-xl mx-auto">
            Common questions from contractors, builders, and traders about {product.name.toLowerCase()}.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {productFaqs(product.name).map((faq) => (
            <details key={faq.q} className="group bg-white rounded-xl border border-navy/8 shadow-sm px-5 py-4">
              <summary className="font-heading text-navy text-base font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                {faq.q}
                <svg className="w-5 h-5 text-orange shrink-0 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </summary>
              <p className="font-body text-navy/60 text-sm leading-relaxed mt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </SectionContainer>

      {/* Contact — CTA + Quote form split panel (same as homepage) */}
      <section className="bg-[#f0ebe0] py-24 md:py-32">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

            {/* Left — CTA + map */}
            <div className="flex flex-col gap-6 py-4">
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em]">Get A Quote</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-snug">
                Get {product.name} at Factory-Direct Wholesale Prices — Across UP.
              </h2>
              <p className="font-body text-ink/65 text-base leading-relaxed">
                Source ISI-certified {product.name.toLowerCase()} directly from our Kanpur manufacturing
                facility. We supply contractors, builders, and traders across Uttar Pradesh at trade
                pricing — with delivery in 2–3 days.
              </p>
              {/* Map — helps B2B buyers verify the facility is real */}
              <div className="rounded-xl overflow-hidden border border-[#ddd4be] shadow-sm flex-1 min-h-[220px]">
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
                  href={`https://wa.me/919918522988?text=${encodeURIComponent(`Hi, I would like to get a bulk quote for ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right — Quote form card */}
            <div className="bg-white/70 border border-[#ddd4be] rounded-2xl shadow-md p-6 lg:p-8">
              <p className="font-heading text-base font-bold text-ink mb-5">Send an Enquiry</p>
              <HomeQuoteForm
                defaultProduct={product.name}
                sourcePage={`product/${product.slug}`}
                submitLabel="Get Free Quote"
              />
            </div>

          </div>
        </div>
      </section>

    </>
  );
}

function productFaqs(productName: string) {
  return [
    {
      q: `What is the minimum order quantity for ${productName}?`,
      a: `We supply both bulk and project-based orders. Minimum order quantities vary by specification — share your requirement and our team will confirm pricing and quantity slabs within 24 hours.`,
    },
    {
      q: `Is ${productName} ISI certified?`,
      a: `Yes. All ${productName.toLowerCase()} manufactured at our Kanpur facility meets ISI standards for material thickness, coating, and structural strength, with quality checks at every production stage.`,
    },
    {
      q: 'Do you deliver outside Kanpur and Uttar Pradesh?',
      a: 'Yes, we deliver pan-India through our established logistics network. Most orders within Uttar Pradesh are delivered in 2–3 days; other states typically take 4–7 days depending on quantity and location.',
    },
    {
      q: 'Can I get custom sizes or specifications?',
      a: `Yes, ${productName.toLowerCase()} can be manufactured to custom thickness, length, and profile specifications for project-specific requirements. Share your drawing or spec sheet for a tailored quote.`,
    },
    {
      q: 'How do I get a price quote?',
      a: 'Fill out the quote form on this page or WhatsApp us directly with your requirement — quantity, specification, and delivery location. Our team responds with factory-direct pricing within 24 hours.',
    },
  ];
}

const WHY_CHOOSE_US = [
  {
    title: 'ISI-Certified Quality',
    body: 'Every batch meets ISI standards for thickness, coating, and strength — verified before dispatch.',
    image: '/images/product-page/quality.jpg',
  },
  {
    title: 'Factory-Direct Pricing',
    body: 'No middlemen markups — buy straight from our Kanpur manufacturing unit at true wholesale rates.',
    image: '/images/product-page/factory.jpg',
  },
  {
    title: 'Bulk & Project Supply',
    body: 'Reliable capacity for contractors, traders, and large-scale industrial orders — no quantity is too big.',
    image: '/images/product-page/warehouse.jpg',
  },
  {
    title: 'Pan-India Delivery',
    body: 'Established logistics network ensuring on-time delivery to project sites across Uttar Pradesh and beyond.',
    image: '/images/product-page/delivery-truck.jpg',
  },
];

function productBenefits(productName: string) {
  return [
    {
      title: 'Durability That Lasts',
      body: `${productName} is engineered to withstand harsh Indian weather conditions — corrosion-resistant and built for long-term performance.`,
      image: '/images/product-page/steel-mill.jpg',
    },
    {
      title: 'Faster, Easier Installation',
      body: `Precision-rolled dimensions and consistent quality reduce on-site fitting time for your project teams.`,
      image: '/images/product-page/roof-install.jpg',
    },
    {
      title: 'Cost-Effective at Scale',
      body: `Wholesale pricing on ${productName} means lower per-unit cost as your order volume grows.`,
      image: '/images/product-page/warehouse.jpg',
    },
    {
      title: 'Backed by Expertise',
      body: `Our engineering team monitors every production run of ${productName} for consistent, dependable output.`,
      image: '/images/product-page/engineer-tablet.jpg',
    },
  ];
}

const MANUFACTURING_STEPS = [
  {
    title: 'Raw Material Sourcing',
    body: 'Premium steel coils sourced from trusted brands like Tata Steel and JSW for consistent base quality.',
    image: '/images/product-page/steel-mill.jpg',
  },
  {
    title: 'Roll Forming',
    body: 'Computer-controlled roll-forming lines shape each sheet to precise profile and thickness tolerances.',
    image: '/images/product-page/engineer-tablet.jpg',
  },
  {
    title: 'Quality Inspection',
    body: 'Every batch is checked for thickness, coating uniformity, and structural integrity before approval.',
    image: '/images/product-page/quality.jpg',
  },
  {
    title: 'Dispatch & Logistics',
    body: 'Packed and dispatched on schedule via our own logistics network, tracked through to delivery.',
    image: '/images/product-page/dispatch-loading.jpg',
  },
];

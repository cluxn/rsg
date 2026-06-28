import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct, getProducts } from '@/lib/api';
import { ProductPageHero } from '@/components/ui/ProductPageHero';
import { StatsSection } from '@/components/sections/StatsSection';
import { SpecsTable } from '@/components/ui/SpecsTable';
import { SectionContainer } from '@/components/layout/SectionContainer';
import HomeQuoteForm from '@/app/(site)/HomeQuoteForm';
import { CcrsBrandExplorer } from '@/components/ui/CcrsBrandExplorer';
import { AccessoryShowcase } from '@/components/ui/AccessoryShowcase';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { getTestimonials } from '@/lib/content';
import { PPGL_BRANDS, PPGI_BRANDS } from '@/components/layout/SiteHeader';

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
  'accessories':                 '/images/products/accessories/accessories-overview.jpg',
  // Colour-coated brand products — official brand banners
  'jsw-colouron':   '/images/products/brands/jsw-colouron.jpg',
  'jsw-silveron':   '/images/products/brands/jsw-silveron.jpg',
  'jsw-pragati':    '/images/products/brands/jsw-pragati.jpg',
  'jsw-endura':     '/images/products/brands/jsw-endura.jpg',
  'tata-durashine': '/images/products/brands/tata-durashine.jpg',
  'jindal-sabrang': '/images/products/brands/jindal-sabrang.jpg',
  'dura-glow':      '/images/products/brands/dura-glow.png',
  'am-ns':          '/images/products/brands/am-ns.jpg',
};

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const title = `${product.name} | RSG Profile Manufacturing`;
  const description = product.description?.slice(0, 155) ?? `${product.name} - RSG Profile Manufacturing Pvt. Ltd.`;
  const image = product.media[0]?.url ?? PRODUCT_CARD_IMAGE[slug] ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${slug}`,
      type: 'website',
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const allTestimonials = await getTestimonials();
  const matching = allTestimonials.filter(
    t => t.product_bought?.toLowerCase() === product.name.toLowerCase()
  );
  const productTestimonials = matching.length > 0 ? matching : allTestimonials;

  const primaryMedia = product.media[0] ?? null;
  const additionalMedia = product.media.slice(1);
  const cardImageUrl = PRODUCT_CARD_IMAGE[product.slug] ?? null;
  const displayImageUrl = primaryMedia?.url ?? cardImageUrl;

  return (
    <>
      <ProductPageHero product={product} />

      <StatsSection />

      <div className="gradient-mesh-light">

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

      {product.slug !== 'accessories' && (
        <div id="specs-section">
          <SpecsTable specs={product.specs} />
        </div>
      )}

      {/* Accessory Showcase — Accessories parent page only */}
      {product.slug === 'accessories' && (
        <SectionContainer>
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
              What We Supply
            </p>
            <h2 className="font-heading text-navy text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Roofing Accessories — Built to Finish the Job
            </h2>
            <p className="font-body text-navy/60 text-base max-w-xl mx-auto">
              Every accessory needed to seal, drain, vent, and fix a roofing sheet installation — supplied wholesale alongside your sheet order.
            </p>
          </div>
          <AccessoryShowcase />
        </SectionContainer>
      )}

      {/* Brands & Variants — Colour Coated Roofing Sheet parent page only */}
      {product.slug === 'colour-coated-roofing-sheet' && (
        <SectionContainer>
          <div className="text-center mb-10">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
              Explore Our Range
            </p>
            <h2 className="font-heading text-navy text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Colour Coated Roofing Sheet Brands &amp; Variants
            </h2>
            <p className="font-body text-navy/60 text-base max-w-xl mx-auto">
              We stock colour coated roofing sheets across leading brands in both PPGL and PPGI categories, plus matching accessories.
            </p>
          </div>

          <CcrsBrandExplorer ppglBrands={PPGL_BRANDS} ppgiBrands={PPGI_BRANDS} />
        </SectionContainer>
      )}

      {/* Colour Options — JSW Colouron+ only */}
      {product.slug === 'jsw-colouron' && (
        <SectionContainer>
          <div className="text-center mb-10">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
              Available Colours
            </p>
            <h2 className="font-heading text-navy text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Variety of Colour Options to Choose From
            </h2>
            <p className="font-body text-navy/60 text-base max-w-xl mx-auto">
              {product.name} is available in 14 vibrant shades suited for every architectural style and climate.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-6 lg:gap-8">
            {COLOUR_PALETTE.map((c) => (
              <div key={c.name + c.img} className="flex flex-col items-center gap-2">
                <div className="relative w-full aspect-[4/3]">
                  <Image src={c.img} alt={c.name} fill className="object-contain" />
                </div>
                <span className="font-body text-navy font-semibold text-xs text-center leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Sheet Specifications — Brand Products Only, 2-column image+table layout */}
      {BRAND_PRODUCT_SLUGS.has(product.slug) && (
        <SectionContainer>
          <div className="text-center mb-10">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
              Technical Details
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl text-navy font-bold mb-3">
              Sheet Specifications
            </h2>
            <p className="font-body text-navy/60 max-w-xl mx-auto">
              Available in two standard profile widths — 1220MM and 1440MM — with thicknesses from 0.30mm to 0.70mm.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {/* 1220MM */}
            <div className="rounded-xl border border-navy/10 overflow-hidden shadow-sm">
              <div className="bg-navy px-5 py-3">
                <h3 className="font-heading text-white font-bold text-base">1220MM Sheet Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative bg-white flex items-center justify-center min-h-[280px]">
                  <Image src="/images/product-page/specs/1220mm.jpg" alt="1220MM Colour Coated Roofing Sheet" fill className="object-contain p-4" />
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {SHEET_SPECS_1220.map((row) => (
                      <tr key={row.label} className="border-b border-navy/8 last:border-0">
                        <td className="font-heading text-navy font-semibold px-5 py-3 bg-steel/5 w-[45%]">{row.label}</td>
                        <td className="font-body text-navy/70 px-5 py-3">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* 1440MM */}
            <div className="rounded-xl border border-navy/10 overflow-hidden shadow-sm">
              <div className="bg-navy px-5 py-3">
                <h3 className="font-heading text-white font-bold text-base">1440MM Sheet Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative bg-white flex items-center justify-center min-h-[280px]">
                  <Image src="/images/product-page/specs/1440mm.jpg" alt="1440MM Colour Coated Roofing Sheet" fill className="object-contain p-4" />
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {SHEET_SPECS_1440.map((row) => (
                      <tr key={row.label} className="border-b border-navy/8 last:border-0">
                        <td className="font-heading text-navy font-semibold px-5 py-3 bg-steel/5 w-[45%]">{row.label}</td>
                        <td className="font-body text-navy/70 px-5 py-3">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionContainer>
      )}

      {/* Why Choose RSG */}
      <SectionContainer>
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

      {/* Brand Advantages */}
      {BRAND_PRODUCT_SLUGS.has(product.slug) && (BRAND_ADVANTAGES[product.slug] ?? []).length > 0 && (
        <SectionContainer>
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
              Why Choose {product.name}
            </p>
            <h2 className="font-heading text-3xl text-navy font-bold mb-3">
              Advantages of {product.name}
            </h2>
            <p className="font-body text-navy/60 max-w-xl mx-auto">
              What sets {product.name} apart as a premium colour-coated roofing solution.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
            {(BRAND_ADVANTAGES[product.slug] ?? []).map((adv) => (
              <div key={adv.title} className="flex flex-col items-center text-center bg-white rounded-2xl border border-navy/8 shadow-sm p-5 lg:p-6 gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange/40 flex items-center justify-center bg-orange/5 shrink-0">
                  <BenefitIcon icon={adv.icon} iconType={adv.iconType} />
                </div>
                <div>
                  <h3 className="font-heading text-navy text-sm font-bold mb-2">{adv.title}</h3>
                  <p className="font-body text-navy/60 text-xs leading-relaxed">{adv.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Applications — not shown for Accessories; AccessoryShowcase already covers per-item use */}
      {product.slug !== 'accessories' && (
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Where It&apos;s Used</p>
          <h2 className="font-heading text-3xl text-navy font-bold mb-3">Applications of {product.name}</h2>
          <p className="font-body text-navy/60 max-w-xl mx-auto">
            Trusted across industrial, commercial, and residential projects throughout India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {productApplications(product.slug).map((a) => (
            <div key={a.title} className="glow-card rounded-xl overflow-hidden flex flex-col">
              <div className="relative h-36 overflow-hidden">
                <Image src={a.image} alt={a.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h4 className="font-heading text-navy text-base font-bold mb-2">{a.title}</h4>
                <p className="font-body text-navy/60 text-sm leading-relaxed">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
      )}

      </div>

      {/* CTA Banner */}
      <div className="gradient-power py-12">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white max-w-2xl leading-snug">
            Trusted Manufacturer &amp; Wholesale Supplier of {product.name} in Kanpur, India
          </h2>
          <p className="font-body text-white/60 text-sm max-w-md">
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

      <div className="gradient-mesh-light">

      {/* Manufacturing process — not shown for Accessories (bought-in items like screws/turbo fans aren't roll-formed in-house) */}
      {product.slug !== 'accessories' && (
      <SectionContainer>
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
      )}

      </div>

      {/* Testimonials */}
      <TestimonialsSection testimonials={productTestimonials} />

      <div className="gradient-mesh-light">

      {/* FAQs */}
      <SectionContainer>
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
      <section className="py-24 md:py-32">
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
            <div className="bg-white/70 border border-navy/10 rounded-2xl shadow-md p-6 lg:p-8">
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

      </div>

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

// ─── Brand product shared data ────────────────────────────────────────────────

const BRAND_PRODUCT_SLUGS = new Set([
  'jsw-colouron', 'jsw-silveron', 'jsw-pragati', 'jsw-endura',
  'tata-durashine', 'jindal-sabrang', 'dura-glow', 'am-ns',
]);

const COLOUR_PALETTE = [
  { name: 'Turquoise Blue',    img: '/images/colour-swatches/turquoise-blue.png' },
  { name: 'Tomato Red',        img: '/images/colour-swatches/tomato-red.png' },
  { name: 'Terra Cota',        img: '/images/colour-swatches/terra-cota.png' },
  { name: 'Seco Red',          img: '/images/colour-swatches/seco-red.png' },
  { name: 'Brick Red',         img: '/images/colour-swatches/brick-red.png' },
  { name: 'Pepsi Blue',        img: '/images/colour-swatches/pepsi-blue.png' },
  { name: 'Off White',         img: '/images/colour-swatches/off-white.png' },
  { name: 'Nova Blue',         img: '/images/colour-swatches/nova-blue.png' },
  { name: 'Mist Green',        img: '/images/colour-swatches/mist-green.png' },
  { name: 'Light Blue',        img: '/images/colour-swatches/light-blue.png' },
  { name: 'Caulifield Green',  img: '/images/colour-swatches/caulfield-green.png' },
  { name: 'Graphite Grey',     img: '/images/colour-swatches/graphite-grey.png' },
  { name: 'Environment Green', img: '/images/colour-swatches/environment-green.png' },
  { name: 'Capri Blue',        img: '/images/colour-swatches/capri-blue.png' },
  { name: 'Brick Red',         img: '/images/colour-swatches/brick-red-2.png' },
];

const BRAND_ADVANTAGES: Record<string, { title: string; body: string; icon?: string; iconType?: string }[]> = {
  'jsw-colouron': [
    { title: '15-Year Warranty', body: "India's first ISI certified colour coated sheet — backed by a 15-year manufacturer warranty.", iconType: 'clock' },
    { title: 'Advanced Anti-Corrosion', body: 'Al-Zn alloy (Galvalume) coating provides superior rust resistance even in coastal and high-humidity environments.', iconType: 'shield-check' },
    { title: 'ISI Certified Quality', body: "India's first ISI certified colour coated sheet, meeting the highest Bureau of Indian Standards benchmarks.", iconType: 'badge' },
    { title: 'Superior Paint Durability', body: 'Factory-baked colour coating resists fading, chalking, and UV degradation for 15+ years of outdoor exposure.', iconType: 'swatch' },
    { title: 'High Tensile Strength', body: 'Yield strength of 550 MPa — engineered to handle structural loads across large-span roofing applications.', iconType: 'bolt' },
    { title: 'Heat Reflective Coating', body: 'Reflective coating reduces heat absorption and keeps interiors cooler, lowering energy costs in warm climates.', iconType: 'sun' },
  ],
  'jsw-silveron': [
    { title: 'Premium Alloy Substrate', body: 'Aluminium-Zinc-Silicon alloy applied via hot-dip process for unmatched corrosion resistance over zinc-only coatings.', iconType: 'cube' },
    { title: 'Heat Reflective Performance', body: 'Superior heat reflectivity compared to traditional zinc-coated sheets — keeps buildings significantly cooler.', iconType: 'sun' },
    { title: 'Lightweight Design', body: 'Reduces structural load on trusses while maintaining exceptional strength and rigidity across large spans.', iconType: 'bolt' },
    { title: 'Long Service Life', body: 'Advanced alloy technology combining superior strength with enhanced corrosion resistance for decades of use.', iconType: 'clock' },
    { title: 'Eco-Friendly & Recyclable', body: 'Manufactured with sustainability in mind — fully recyclable at end of life without loss of material quality.', iconType: 'leaf' },
    { title: 'Versatile Applications', body: 'Suitable for residential, commercial, and industrial roofing and wall profile applications.', iconType: 'grid' },
  ],
  'jsw-pragati': [
    { title: 'Anti-Corrosion Protection', body: 'Al-Zn alloy coating provides enhanced protection against harsh weather and corrosive environments.', icon: '/images/product-page/icons/pragati-anti-corrosion.png' },
    { title: 'Superior Structural Strength', body: 'Advanced manufacturing technology delivers high tensile steel with 550 MPa yield strength.', icon: '/images/product-page/icons/pragati-strength.png' },
    { title: 'All Weather Protection', body: 'Reliable defense across all climates — heavy monsoons, scorching summers, and coastal humidity.', icon: '/images/product-page/icons/pragati-weather.png' },
    { title: '7-Year Warranty', body: "Backed by a manufacturer's 7-year warranty, giving you confidence in long-term performance.", icon: '/images/product-page/icons/pragati-warranty.png' },
    { title: 'Wide Range of Colours', body: '14 vibrant colour options to suit every architectural style and project requirement.', icon: '/images/product-page/icons/pragati-colours.png' },
    { title: 'Pre-Painted Finish', body: 'Factory-applied colour coating combines the strength of steel with the aesthetic appeal of paint.', iconType: 'swatch' },
  ],
  'jsw-endura': [
    { title: 'Structural Strength That Lasts', body: 'High-tensile steel construction withstands harsh elements — rain, wind, and seismic activity.', iconType: 'bolt' },
    { title: 'UV-Resistant Colours', body: 'Vibrant colours that retain their brilliance even under intense sunlight and prolonged outdoor exposure.', iconType: 'sun' },
    { title: 'Corrosion-Resistant Protection', body: 'Al-Zn alloy coating shields against rust in coastal, urban, and industrial environments.', iconType: 'shield-check' },
    { title: 'Versatile Roofing Solution', body: 'Lightweight and durable, suitable for diverse architectural styles with easy, fast installation.', iconType: 'home' },
    { title: 'BIS Certified Quality', body: 'Certified by Bureau of Indian Standards — meeting the highest standards of quality and performance.', iconType: 'badge' },
    { title: 'Affordable Value That Lasts', body: 'High-performance durability at an affordable price, delivering long-term savings on maintenance costs.', iconType: 'currency' },
  ],
  'tata-durashine': [
    { title: 'Better Corrosion Resistance', body: 'Zinc-aluminium alloy coating ensures longer life by providing superior protection against corrosion.', icon: '/images/product-page/icons/durashine-why1.png' },
    { title: 'High Strength & Load Bearing', body: 'Engineered for structural integrity — handles demanding loads on large-span industrial and commercial roofs.', icon: '/images/product-page/icons/durashine-why2.png' },
    { title: 'Cooler Interiors', body: 'High solar reflectance coating significantly reduces heat absorption, keeping interiors noticeably cooler.', icon: '/images/product-page/icons/durashine-why5.png' },
    { title: 'Performs Better During Rains', body: 'Excellent water runoff characteristics and sealed profile prevent leakage even during heavy monsoons.', icon: '/images/product-page/icons/durashine-why3.png' },
    { title: 'Aesthetically Appealing', body: 'High-gloss, vibrant colour finish adds visual appeal to residential, commercial, and industrial structures.', icon: '/images/product-page/icons/durashine-why6.png' },
    { title: 'Wide Product Range', body: 'Available in 14 colours and multiple profile widths (1220MM / 1440MM) to suit any project.', icon: '/images/product-page/icons/durashine-why4.png' },
    { title: "Asia's Most Trusted Brand", body: "Recognised as Asia's Most Trusted Brand for Best Colour Coated Steel Sheet by International Brand Consulting Corporation, USA.", iconType: 'badge' },
    { title: 'Mark of Genuinity', body: 'Every Tata Durashine sheet carries the genuine Durashine brand mark — ensuring you get an authentic, quality-verified product.', icon: '/images/product-page/icons/durashine-why7.png' },
    { title: 'Recommended Fabricators', body: 'Supported by a network of trained and recommended fabricators across India for professional installation.', icon: '/images/product-page/icons/durashine-why8.png' },
  ],
  'jindal-sabrang': [
    { title: 'Better Corrosion Resistance', body: 'Zinc/Alu-Zinc coating provides an additional protective layer, ensuring longer life for all structures.', icon: '/images/product-page/icons/durashine-why1.png' },
    { title: 'High Strength & Load Bearing', body: 'Engineered to handle demanding structural loads across a wide range of building types.', icon: '/images/product-page/icons/durashine-why2.png' },
    { title: 'Cooler Interiors', body: 'Reflective coating reduces heat absorption, keeping building interiors more comfortable year-round.', icon: '/images/product-page/icons/durashine-why5.png' },
    { title: 'Performs Better During Rains', body: 'Optimised profile design ensures excellent water runoff and weather-tight performance.', icon: '/images/product-page/icons/durashine-why3.png' },
    { title: 'Aesthetically Appealing', body: '14 vibrant colours derived from the Sanskrit word for "rainbow" — adding colour to the world of steel.', icon: '/images/product-page/icons/durashine-why6.png' },
    { title: 'Wide Product Range', body: 'Available in multiple widths, thicknesses, and colour combinations to match any project need.', icon: '/images/product-page/icons/durashine-why4.png' },
  ],
  'dura-glow': [
    { title: 'Strong Durability', body: 'High-strength steel substrate with advanced colour-coating technology delivers excellent long-term durability.', iconType: 'bolt' },
    { title: 'Excellent Weather Resistance', body: 'Multi-layer protective coatings resist oxidation and UV degradation for lasting outdoor performance.', iconType: 'cloud' },
    { title: 'Long-Lasting Shine', body: 'Factory-applied gloss coating maintains brilliant colour and shine even after years of outdoor exposure.', iconType: 'sparkles' },
    { title: 'Corrosion Protection', body: 'Zinc-based coating system protects against rust and corrosion in humid and exposed environments.', iconType: 'shield-check' },
    { title: 'Lightweight & Easy to Install', body: 'Optimised sheet geometry reduces structural load while making handling and installation faster on site.', iconType: 'wrench' },
    { title: 'Versatile Applications', body: 'Suitable for factories, warehouses, poultry farms, homes, temples, and resorts.', iconType: 'grid' },
  ],
  'am-ns': [
    { title: 'World-Class Steel Quality', body: 'A joint venture between ArcelorMittal and Nippon Steel — two of the world\'s leading steel companies.', iconType: 'badge' },
    { title: 'High Strength', body: 'Engineered for excellent load-bearing capacity across industrial, commercial, and residential roofing.', icon: '/images/product-page/icons/durashine-why2.png' },
    { title: 'Thermal Efficiency', body: 'Reflective coating reduces solar heat gain, keeping interiors cooler and reducing energy costs.', icon: '/images/product-page/icons/durashine-why5.png' },
    { title: 'Excellent Weather Performance', body: 'Performs reliably during heavy rains and harsh weather conditions year after year.', icon: '/images/product-page/icons/durashine-why3.png' },
    { title: 'Aesthetically Appealing', body: '14 vibrant colour options for attractive, visually appealing roofing across any building type.', icon: '/images/product-page/icons/durashine-why6.png' },
    { title: 'Fire & Impact Resistant', body: 'Meets international safety standards for fire resistance and impact durability.', icon: '/images/product-page/icons/durashine-why8.png' },
  ],
};

const BENEFIT_ICON_PATHS: Record<string, string> = {
  cube:          'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  sun:           'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
  bolt:          'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  clock:         'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  leaf:          'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99',
  grid:          'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  'shield-check':'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  swatch:        'M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z',
  home:          'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  badge:         'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  currency:      'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  sparkles:      'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  cloud:         'M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z',
  wrench:        'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z',
};

function BenefitIcon({ icon, iconType }: { icon?: string; iconType?: string }) {
  if (icon) {
    return (
      <div className="relative w-12 h-12">
        <Image src={icon} alt="" fill className="object-contain" />
      </div>
    );
  }
  const d = BENEFIT_ICON_PATHS[iconType ?? 'shield-check'] ?? BENEFIT_ICON_PATHS['shield-check'];
  return (
    <svg className="w-10 h-10 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const SHEET_SPECS_1220 = [
  { label: 'Overall Width',    value: '1220mm' },
  { label: 'Effective Cover',  value: '1060mm' },
  { label: 'Thickness Range',  value: '0.30mm – 0.70mm' },
  { label: 'Pitch',            value: '200mm ± 10mm' },
  { label: 'Crest Height',     value: '28mm ± 2mm' },
  { label: 'Max Length',       value: 'Up to 50 ft' },
  { label: 'Substrate',        value: 'AZ70 / AZ150 (Al-Zn Alloy)' },
];

const SHEET_SPECS_1440 = [
  { label: 'Overall Width',    value: '1440mm' },
  { label: 'Effective Cover',  value: '1220mm' },
  { label: 'Thickness Range',  value: '0.30mm – 0.70mm' },
  { label: 'Pitch',            value: '200mm ± 10mm' },
  { label: 'Crest Height',     value: '28mm ± 2mm' },
  { label: 'Max Length',       value: 'Up to 50 ft' },
  { label: 'Substrate',        value: 'AZ70 / AZ150 (Al-Zn Alloy)' },
];

const BRAND_SHEET_BENEFITS = [
  { title: 'Superior Corrosion Resistance', body: 'Al-Zn alloy (Galvalume) coating provides lasting protection against rust in all weather conditions.' },
  { title: 'Vibrant, Long-Lasting Colour',  body: '14 factory-baked colour options resist fading and chalking for 10+ years of outdoor exposure.' },
  { title: 'Heat-Reflective Performance',   body: 'Reflective coating reduces heat absorption, keeping interiors cooler and reducing energy costs.' },
  { title: 'Lightweight Yet Strong',        body: 'High tensile strength (550 MPa) with lightweight design reduces structural load on roof trusses.' },
];

const BRAND_SHEET_APPLICATIONS = [
  { title: 'Residential Homes & Villas',          body: 'Durable, attractive roofing for modern homes and rural residences across India.' },
  { title: 'Industrial Warehouses & Sheds',        body: 'Wide-span roofing for factories, godowns, and logistics facilities.' },
  { title: 'Commercial & Institutional Buildings', body: 'Schools, hospitals, office buildings, and commercial complexes.' },
  { title: 'Agricultural & Farm Structures',       body: 'Weather-resistant roofing for poultry farms, grain storage, and dairy facilities.' },
];

// ─── End brand product shared data ───────────────────────────────────────────

const PRODUCT_BENEFITS: Record<string, { title: string; body: string; image?: string }[]> = {
  'colour-coated-roofing-sheet': [
    { title: 'Superior Corrosion Resistance', body: 'PPGL/PPGI coating with a zinc-aluminium layer resists rust even in humid and coastal climates.', image: '/images/product-page/benefits/corrosion-resistance.png' },
    { title: 'Vibrant, Long-Lasting Colour', body: 'Factory-baked colour coating resists fading and chalking for 10+ years of outdoor exposure.', image: '/images/product-page/benefits/vibrant-colour.png' },
    { title: 'Lightweight Yet Strong', body: 'Reduces structural load on trusses while maintaining high tensile strength.', image: '/images/product-page/benefits/lightweight-strong.png' },
    { title: 'Reflects Heat, Stays Cool', body: 'Reflective coating reduces heat absorption, keeping interiors noticeably cooler.', image: '/images/product-page/benefits/heat-reflective.png' },
  ],
  'ms-plate-channel-angle': [
    { title: 'High Load-Bearing Strength', body: 'Engineered for heavy structural and fabrication loads without compromising on safety margins.' },
    { title: 'Precise Dimensional Accuracy', body: 'Consistent thickness and tolerances make welding and fabrication faster and more accurate.' },
    { title: 'Versatile Grades & Sizes', body: 'Wide range of plates, channels, and angles available for varied structural requirements.' },
    { title: 'Cost-Efficient Structural Solution', body: 'A reliable, economical choice for general fabrication compared to specialty alloys.' },
  ],
  'ms-pipe': [
    { title: 'High Tensile Strength', body: 'Withstands heavy structural and pressure loads across construction and industrial use.' },
    { title: 'Seamless, Uniform Quality', body: 'Consistent wall thickness across every length for dependable, predictable performance.' },
    { title: 'Corrosion-Resistant Options', body: 'Available in coated grades suited for outdoor and exposed installations.' },
    { title: 'Easy to Weld & Fabricate', body: 'Cuts, welds, and joins cleanly for fast on-site fabrication work.' },
  ],
  'decking-sheet': [
    { title: 'High Load-Bearing Capacity', body: 'Trapezoidal profile supports heavy composite concrete floor loads with confidence.' },
    { title: 'Reduces Construction Time', body: 'Acts as permanent shuttering — no formwork removal needed, speeding up the build.' },
    { title: 'Saves Concrete & Reinforcement', body: 'Profiled shape reduces material usage without compromising structural strength.' },
    { title: 'Precision-Rolled Quality', body: 'Uniform thickness and profile across every sheet for predictable site performance.' },
  ],
  'purlins': [
    { title: 'Lightweight Yet Strong', body: 'Z & C profiles maximize strength-to-weight ratio for efficient roof and wall framing.' },
    { title: 'Precision-Rolled Profiles', body: 'Consistent dimensions ensure accurate alignment during roof and wall erection.' },
    { title: 'Faster Installation', body: 'Standard lengths and pre-punched holes speed up on-site erection work.' },
    { title: 'Long Span Capability', body: 'Reduces the number of support points needed across large roofing spans.' },
  ],
  'polycarbonate-sheet': [
    { title: 'UV-Resistant & Shatterproof', body: 'Withstands impact while blocking harmful UV rays from passing through.' },
    { title: 'Excellent Light Transmission', body: 'Brings in natural daylight without the heat buildup of standard glazing.' },
    { title: 'Lightweight & Flexible', body: 'Easy to install on curved or flat roofing without added structural load.' },
    { title: 'Weatherproof Durability', body: 'Resists yellowing and weather degradation for long-term outdoor performance.' },
  ],
  'crimping-sheet': [
    { title: 'Versatile Crimped Profile', body: 'Adapts to both curved and straight roofing applications with ease.' },
    { title: 'Strong Wind & Load Resistance', body: 'Corrugated profile adds structural rigidity against wind uplift and load.' },
    { title: 'Quick, Easy Installation', body: 'Lightweight sheets reduce labour time and handling effort on site.' },
    { title: 'Cost-Effective Coverage', body: 'An economical roofing solution for covering large areas efficiently.' },
  ],
  'galvanized-plain-sheets': [
    { title: 'Zinc-Coated Corrosion Protection', body: 'Extends service life significantly in humid and exposed environments.' },
    { title: 'Smooth, Flat Surface Finish', body: 'Ideal base for further fabrication, painting, or coating work.' },
    { title: 'Excellent Weldability & Formability', body: 'Cuts, bends, and joins cleanly for fast, reliable fabrication.' },
    { title: 'Uniform Thickness Control', body: 'Consistent quality and gauge maintained across every sheet.' },
  ],
  // Colour-coated brand products share the same core benefits
  'jsw-colouron':   BRAND_SHEET_BENEFITS,
  'jsw-silveron':   BRAND_SHEET_BENEFITS,
  'jsw-pragati':    BRAND_SHEET_BENEFITS,
  'jsw-endura':     BRAND_SHEET_BENEFITS,
  'tata-durashine': BRAND_SHEET_BENEFITS,
  'jindal-sabrang': BRAND_SHEET_BENEFITS,
  'dura-glow':      BRAND_SHEET_BENEFITS,
  'am-ns':          BRAND_SHEET_BENEFITS,
};

const DEFAULT_BENEFITS = [
  { title: 'Built to ISI Standards', body: 'Manufactured under strict quality control for consistently dependable performance.' },
  { title: 'Engineered for Durability', body: 'Resists wear and weathering across demanding job site conditions.' },
  { title: 'Consistent Sizing & Finish', body: 'Every batch matches exact specifications, batch after batch.' },
  { title: 'Easy to Install & Use', body: 'Designed for fast, hassle-free application on site.' },
];

function productBenefits(slug: string) {
  const items = PRODUCT_BENEFITS[slug] ?? DEFAULT_BENEFITS;
  const fallbackImage = PRODUCT_CARD_IMAGE[slug] ?? null;
  return items.map(item => ({ ...item, image: item.image ?? fallbackImage }));
}

const APPLICATION_IMAGES = [
  '/images/product-page/factory.jpg',
  '/images/product-page/roof-install.jpg',
  '/images/product-page/steel-mill.jpg',
  '/images/product-page/warehouse.jpg',
];

const PRODUCT_APPLICATIONS: Record<string, { title: string; body: string }[]> = {
  'colour-coated-roofing-sheet': [
    { title: 'Industrial Sheds & Warehouses', body: 'Wide-span roofing for factories, godowns, and logistics facilities.' },
    { title: 'Residential & Commercial Roofing', body: 'A durable, attractive roofing choice for homes and office buildings.' },
    { title: 'Cold Storage & Insulated Buildings', body: 'Reflective coating supports temperature-controlled structures.' },
    { title: 'Poultry Farms & Agri Structures', body: 'Weatherproof covering suited for farm buildings and livestock sheds.' },
  ],
  'ms-plate-channel-angle': [
    { title: 'Structural Framework & Trusses', body: 'Forms the backbone of roof trusses and load-bearing frames.' },
    { title: 'Machine Fabrication & Workshops', body: 'Base material for machine frames, brackets, and custom fabrication.' },
    { title: 'Industrial Construction Projects', body: 'Used across factory builds, platforms, and equipment supports.' },
    { title: 'Infrastructure Components', body: 'Suited for bridges, gantries, and other heavy infrastructure work.' },
  ],
  'ms-pipe': [
    { title: 'Structural Columns & Scaffolding', body: 'Provides reliable vertical and temporary structural support.' },
    { title: 'Fluid & Water Transport Lines', body: 'Used in piping systems for water and industrial fluid transport.' },
    { title: 'Furniture & Railing Fabrication', body: 'A popular choice for handrails, gates, and metal furniture frames.' },
    { title: 'Industrial Piping Systems', body: 'Suited for process piping across factories and plants.' },
  ],
  'decking-sheet': [
    { title: 'Multi-Storey Composite Floors', body: 'Permanent shuttering for fast, efficient composite floor construction.' },
    { title: 'Mezzanine Flooring Systems', body: 'Lightweight yet strong flooring solution for added warehouse space.' },
    { title: 'Industrial & Commercial Buildings', body: 'Speeds up floor construction across large commercial developments.' },
    { title: 'Parking Structures', body: 'Durable flooring base suited for multi-level parking decks.' },
  ],
  'purlins': [
    { title: 'Industrial Roofing Systems', body: 'Provides the structural support roof sheeting is fixed onto.' },
    { title: 'Pre-Engineered Steel Buildings', body: 'A core component in fast-erecting PEB structures.' },
    { title: 'Warehouse & Factory Structures', body: 'Supports large-span roofing across industrial buildings.' },
    { title: 'Wall Cladding Framework', body: 'Provides the supporting frame for wall sheeting and cladding.' },
  ],
  'polycarbonate-sheet': [
    { title: 'Skylights & Roof Lighting', body: 'Brings natural daylight into factories, sheds, and commercial spaces.' },
    { title: 'Greenhouses & Agri Covers', body: 'UV-stable covering ideal for greenhouse and polyhouse structures.' },
    { title: 'Canopies & Walkway Roofing', body: 'Lightweight, transparent covering for walkways and entrance canopies.' },
    { title: 'Industrial Daylighting Panels', body: 'Reduces daytime lighting costs across large industrial floor areas.' },
  ],
  'crimping-sheet': [
    { title: 'Industrial & Commercial Roofing', body: 'A cost-effective roofing option for factories and commercial sheds.' },
    { title: 'Warehouse Cladding', body: 'Used for both roofing and wall cladding across warehouse structures.' },
    { title: 'Agricultural Sheds', body: 'Durable, weatherproof covering for farm and storage structures.' },
    { title: 'Temporary & Portable Structures', body: 'Lightweight sheets suited for quick-build temporary structures.' },
  ],
  'galvanized-plain-sheets': [
    { title: 'Automobile Body Parts', body: 'Used in automotive fabrication where formability and finish matter.' },
    { title: 'Electrical Panels & Enclosures', body: 'A preferred material for electrical enclosure manufacturing.' },
    { title: 'Ducting & Ventilation Systems', body: 'Smooth surface and formability suit HVAC ducting fabrication.' },
    { title: 'Furniture, Racks & Cabinets', body: 'A versatile base material for metal furniture and storage racks.' },
  ],
  // Colour-coated brand products share the same core applications
  'jsw-colouron':   BRAND_SHEET_APPLICATIONS,
  'jsw-silveron':   BRAND_SHEET_APPLICATIONS,
  'jsw-pragati':    BRAND_SHEET_APPLICATIONS,
  'jsw-endura':     BRAND_SHEET_APPLICATIONS,
  'tata-durashine': BRAND_SHEET_APPLICATIONS,
  'jindal-sabrang': BRAND_SHEET_APPLICATIONS,
  'dura-glow':      BRAND_SHEET_APPLICATIONS,
  'am-ns':          BRAND_SHEET_APPLICATIONS,
};

const DEFAULT_APPLICATIONS = [
  { title: 'Industrial & Commercial Construction', body: 'Suited for a wide range of factory, warehouse, and commercial builds.' },
  { title: 'Roofing & Cladding Projects', body: 'A dependable material choice across roofing and cladding applications.' },
  { title: 'Structural Fabrication Work', body: 'Used in fabrication workshops for custom structural components.' },
  { title: 'Maintenance & Retrofit Projects', body: 'A reliable option for repairs, upgrades, and retrofit work on site.' },
];

function productApplications(slug: string) {
  const items = PRODUCT_APPLICATIONS[slug] ?? DEFAULT_APPLICATIONS;
  return items.map((item, i) => ({ ...item, image: APPLICATION_IMAGES[i % APPLICATION_IMAGES.length] }));
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

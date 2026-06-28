import Image from 'next/image';
import type { Product } from '@/lib/api';
import HomeQuoteForm from '@/app/(site)/HomeQuoteForm';

const PRODUCT_CARD_IMAGE: Record<string, string> = {
  'colour-coated-roofing-sheet': '/images/products/colour-coated-roofing-sheet-new.png',
  'decking-sheet': '/images/products/decking-sheet.png',
  'galvanized-plain-sheets': '/images/products/galvanized-plain-sheets.png',
  'purlins': '/images/products/purlins.png',
  'crimping-sheet': '/images/products/crimping-sheet-new.png',
  'ms-plate-channel-angle': '/images/products/ms-plate-channel-angle.png',
  'polycarbonate-sheet': '/images/products/polycarbonate-sheet.png',
  'ms-pipe': '/images/products/ms-pipe.png',
  'accessories': '/images/products/accessories/accessories-overview.jpg',
  // Colour-coated brand products — official brand banners
  'jsw-colouron':   '/images/products/brands/jsw-colouron.jpg',
  'jsw-silveron':   '/images/products/brands/jsw-silveron.jpg',
  'jsw-pragati':    '/images/products/brands/jsw-pragati.jpg',
  'jsw-endura':     '/images/products/brands/jsw-endura.jpg',
  'tata-durashine': '/images/products/brands/tata-durashine.jpg',
  'jindal-sabrang': '/images/products/brands/jindal-sabrang.jpg',
  'dura-glow':      '/images/products/brands/dura-glow-v3.png',
  'am-ns':          '/images/products/brands/am-ns.jpg',
};

const FORM_OPTION: Record<string, string> = {
  'colour-coated-roofing-sheet': 'Colour Coated Roofing Sheet',
  'ms-plate-channel-angle': 'MS Plate, Channel & Angle',
  'ms-pipe': 'MS Pipe',
  'decking-sheet': 'Decking Sheet',
  'purlins': 'C and Z Purlins',
  'polycarbonate-sheet': 'Polycarbonate Sheet',
  'crimping-sheet': 'Crimping Sheet',
  'accessories': 'Accessories',
  'galvanized-plain-sheets': 'Galvanized Plain Sheets',
  'jsw-colouron':   'JSW Colouron+',
  'jsw-silveron':   'JSW Silveron+',
  'jsw-pragati':    'JSW Pragati+',
  'jsw-endura':     'JSW Endura+',
  'tata-durashine': 'Tata Durashine',
  'jindal-sabrang': 'JINDAL Sabrang',
  'dura-glow':      'Dura Glow',
  'am-ns':          'AM/NS',
};

// Dark overlay: left side dense (text legible), right fades so image shows through
const BG_OVERLAY =
  'radial-gradient(ellipse 80% 100% at 10% 50%, rgba(4,16,31,0.97) 0%, rgba(4,16,31,0.75) 45%, rgba(4,16,31,0.25) 100%), ' +
  'linear-gradient(to bottom, rgba(4,16,31,0.55) 0%, rgba(4,16,31,0) 30%, rgba(4,16,31,0.65) 100%)';

interface ProductPageHeroProps {
  product: Pick<Product, 'name' | 'slug' | 'description' | 'media'>;
}

export function ProductPageHero({ product }: ProductPageHeroProps) {
  const imgUrl =
    PRODUCT_CARD_IMAGE[product.slug] ??
    product.media[0]?.url ??
    '/images/hero/industrial-bg.webp';

  const desc = product.description
    ? product.description.length > 220
      ? product.description.slice(0, 220) + '…'
      : product.description
    : null;

  const preselected = FORM_OPTION[product.slug] ?? product.name;

  return (
    <section className="relative gradient-power overflow-hidden">

      {/* Background — product card image with dark overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src={imgUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0" style={{ background: BG_OVERLAY }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="min-h-[640px] flex items-center py-20 lg:py-28">
          <div className="w-full grid lg:grid-cols-[1fr_540px] gap-10 lg:gap-10 items-center">

            {/* Left — B2B hero copy */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-orange shrink-0" aria-hidden="true" />
                <span className="font-body text-orange text-xs font-bold uppercase tracking-[0.2em]">
                  RSG Profile Manufacturing
                </span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-[52px] text-white font-bold leading-tight mb-5">
                {product.name}
              </h1>

              {desc && (
                <p className="font-body text-white/65 text-base lg:text-[17px] leading-relaxed mb-8 max-w-lg">
                  {desc}
                </p>
              )}

              {/* Trust pills — glassmorphic like homepage hero */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  ISI Certified · Wholesale &amp; Bulk Supply
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Kanpur Manufacturer · Est. 2019
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pan-UP Delivery · Trade &amp; Project Orders
                </span>
              </div>

              <a
                href="#product-hero-form"
                className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-8 py-3.5 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Free Quote
              </a>
            </div>

            {/* Right — white form card, sharp contrast against dark hero */}
            <div id="product-hero-form" className="bg-white rounded-2xl shadow-2xl p-7 lg:p-8">
              <h2 className="font-heading text-navy text-xl font-bold mb-1">Get a Free Quote</h2>
              <p className="font-body text-navy/50 text-sm mb-5">
                Fill in your details — we respond within 24 hours.
              </p>
              <HomeQuoteForm
                defaultProduct={preselected}
                sourcePage={`product/${product.slug}`}
                submitLabel="Get Free Quote"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

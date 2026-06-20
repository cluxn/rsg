import Image from 'next/image';
import type { Product } from '@/lib/api';
import HomeQuoteForm from '@/app/(site)/HomeQuoteForm';

// Same images used on the homepage product cards — consistent visual identity
const PRODUCT_CARD_IMAGE: Record<string, string> = {
  'colour-coated-roofing-sheet': '/images/products/colour-coated-roofing-sheet-new.png',
  'decking-sheet': '/images/products/decking-sheet.png',
  'galvanized-plain-sheets': '/images/products/galvanized-plain-sheets.png',
  'purlins': '/images/products/purlins.png',
  'crimping-sheet': '/images/products/crimping-sheet-new.png',
  'ms-plate-channel-angle': '/images/products/ms-plate-channel-angle.png',
  'polycarbonate-sheet': '/images/products/polycarbonate-sheet.png',
  'ms-pipe': '/images/products/ms-pipe.png',
};

// Maps DB product name/slug to the form option string for pre-selection
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
};

interface ProductPageHeroProps {
  product: Pick<Product, 'name' | 'slug' | 'description' | 'media'>;
}

export function ProductPageHero({ product }: ProductPageHeroProps) {
  const bgUrl =
    PRODUCT_CARD_IMAGE[product.slug] ??
    product.media[0]?.url ??
    '/images/hero/industrial-bg.webp';

  const desc = product.description
    ? product.description.length > 200
      ? product.description.slice(0, 200) + '…'
      : product.description
    : null;

  const preselected = FORM_OPTION[product.slug] ?? product.name;

  return (
    <section className="relative gradient-power overflow-hidden">
      {/* Background — product card image with dark overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src={bgUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="min-h-[600px] flex items-center py-14 lg:py-16">
          <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-10 items-center">

            {/* Left — B2B hero copy */}
            <div>
              <p className="font-body text-sm text-cyan/80 font-semibold uppercase tracking-[0.18em] mb-4">
                RSG Profile Manufacturing
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[52px] text-white font-bold leading-tight mb-5">
                {product.name}
              </h1>
              {desc && (
                <p className="font-body text-white/65 text-base lg:text-[17px] leading-relaxed mb-8 max-w-lg">
                  {desc}
                </p>
              )}
              <a
                href="#product-hero-form"
                className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3.5 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Free Quote
              </a>
            </div>

            {/* Right — quote form card (same component as homepage) */}
            <div id="product-hero-form" className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <h2 className="font-heading text-ink text-xl font-bold mb-1">Get a Free Quote</h2>
              <p className="font-body text-ink/50 text-sm mb-5">
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

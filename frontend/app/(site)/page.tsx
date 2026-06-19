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
    image: '/images/products/colour-coated-roofing-sheet.png',
  },
  {
    name: 'Decking Sheet',
    slug: 'decking-sheet',
    desc: 'Composite floor decking engineered for multi-storey commercial and industrial construction.',
    image: '/images/products/decking-sheet.png',
  },
  {
    name: 'Galvanized Plain Sheets',
    slug: 'galvanized-plain-sheets',
    desc: 'High-quality GI plain sheets for versatile structural, fabrication, and general applications.',
    image: '/images/products/galvanized-plain-sheets.png',
  },
  {
    name: 'C and Z Purlins',
    slug: 'purlins',
    desc: 'Precision-rolled Z & C purlins for industrial roofing systems — lightweight yet exceptionally strong.',
    image: '/images/products/purlins.png',
  },
  {
    name: 'Crimping Sheet',
    slug: 'crimping-sheet',
    desc: 'Precision-crimped sheets for versatile industrial and commercial roofing applications.',
    image: '/images/products/crimping-sheet.png',
  },
  {
    name: 'MS Plate / Channel / Angle',
    slug: 'ms-plate-channel-angle',
    desc: 'Structural MS plates, channels and angles for heavy-duty fabrication and construction projects.',
    image: '/images/products/ms-plate-channel-angle.png',
  },
  {
    name: 'Polycarbonate Sheet',
    slug: 'polycarbonate-sheet',
    desc: 'UV-resistant transparent roofing panels that bring natural daylight into any structure.',
    image: '/images/products/polycarbonate-sheet.png',
  },
  {
    name: 'Mild Steel Pipes',
    slug: 'ms-pipe',
    desc: 'Structural MS pipes from APL Apollo, Tata & JSW — trusted for heavy-duty construction needs.',
    image: '/images/products/ms-pipe.png',
  },
];

const TESTIMONIALS = [
  { quote: 'Satisfactory service and behaviour.', name: 'Shivkant Dixit', source: 'Google', rating: 5 },
  { quote: 'Extremely professional company with good quality products.', name: 'Arvind Yadav', source: 'Google', rating: 5 },
  { quote: 'Very Nice and Good approaching system in this organisation.', name: 'Vijay Prajapati', source: 'IndiaMART', rating: 4 },
];

const RATINGS = [
  { platform: 'Google', score: '4.8★', count: '219+ reviews' },
  { platform: 'IndiaMART', score: '4.7★', count: '272+ ratings' },
  { platform: 'Justdial', score: '4.9★', count: '184+ reviews' },
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

      {/* Section 2.5 — Catalogue CTA + Why Choose RSG */}
      {/* Banner strip */}
      <div className="bg-[#f0ebe0] border-b border-[#ddd4be] py-8">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-steel max-w-2xl leading-snug">
            Download Our Product Catalogue &amp; Get a Free Quote on Bulk Roofing &amp; Steel Orders
          </h2>
          <a
            href="https://wa.me/919918522988?text=Hi%2C%20I%20would%20like%20to%20request%20your%20product%20catalogue%20and%20get%20a%20free%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Request Catalogue
          </a>
        </div>
      </div>
      {/* Why Choose RSG strip */}
      <section className="bg-white py-16 border-b border-off-white">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink text-center mb-12">
            Why We&apos;re the Top Suppliers of Roofing Sheets &amp; Structural Steel in UP
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            {/* 1 — ISI Certified */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                  <circle cx="40" cy="40" r="36" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
                  <path d="M40 18 L52 24 L52 40 C52 50 40 58 40 58 C40 58 28 50 28 40 L28 24 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M40 22 L50 27 L50 40 C50 48.5 40 55.5 40 55.5 C40 55.5 30 48.5 30 40 L30 27 Z" fill="url(#shield-fill)" />
                  <path d="M34 40 L38 44 L47 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="40" y="68" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="700" fill="#c2410c">ISI</text>
                  <defs>
                    <linearGradient id="shield-fill" x1="28" y1="22" x2="52" y2="56" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fb923c" />
                      <stop offset="1" stopColor="#c2410c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink mb-1.5">100% ISI Certified</p>
                <p className="font-body text-xs text-ink/60 leading-relaxed">Every product manufactured to BIS &amp; ISI standards — no compromise on grade or quality.</p>
              </div>
            </div>

            {/* 2 — Grade Tested */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                  <circle cx="40" cy="40" r="36" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
                  <rect x="35" y="20" width="10" height="18" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M33 38 L25 56 C25 59 27 62 30 62 L50 62 C53 62 55 59 55 56 L47 38 Z" fill="url(#flask-fill)" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />
                  <ellipse cx="40" cy="54" rx="8" ry="4" fill="#93c5fd" opacity="0.6" />
                  <circle cx="35" cy="50" r="2" fill="#60a5fa" opacity="0.8" />
                  <circle cx="45" cy="56" r="1.5" fill="#93c5fd" opacity="0.9" />
                  <path d="M35 20 L45 20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M36 23 L44 23" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
                  <text x="40" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="6.5" fontWeight="700" fill="#1d4ed8">TESTED</text>
                  <defs>
                    <linearGradient id="flask-fill" x1="25" y1="38" x2="55" y2="62" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#dbeafe" />
                      <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink mb-1.5">100% Grade Assured</p>
                <p className="font-body text-xs text-ink/60 leading-relaxed">All materials sourced from top-tier mills and verified for structural grade quality with strict checks.</p>
              </div>
            </div>

            {/* 3 — Satisfied Clients */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                  <circle cx="40" cy="40" r="36" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2" />
                  {/* 3 people */}
                  <circle cx="28" cy="36" r="7" fill="#5eead4" stroke="#0d9488" strokeWidth="1.2" />
                  <path d="M16 56 C16 48 22 44 28 44 C34 44 40 48 40 56" fill="#5eead4" stroke="#0d9488" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="40" cy="33" r="8" fill="#2dd4bf" stroke="#0d9488" strokeWidth="1.5" />
                  <path d="M26 56 C26 47 33 43 40 43 C47 43 54 47 54 56" fill="#2dd4bf" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="52" cy="36" r="7" fill="#5eead4" stroke="#0d9488" strokeWidth="1.2" />
                  <path d="M40 56 C40 48 46 44 52 44 C58 44 64 48 64 56" fill="#5eead4" stroke="#0d9488" strokeWidth="1.2" strokeLinecap="round" />
                  {/* stars above */}
                  {[24, 32, 40, 48, 56].map((x, i) => (
                    <path key={i} d={`M${x} 18 l1.2 2.4 2.6 0.4-1.9 1.8 0.4 2.6-2.3-1.2-2.3 1.2 0.4-2.6-1.9-1.8 2.6-0.4z`}
                      fill={i < 4 ? '#f59e0b' : '#fde68a'} stroke="#d97706" strokeWidth="0.3" />
                  ))}
                </svg>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink mb-1.5">525+ Satisfied Clients</p>
                <p className="font-body text-xs text-ink/60 leading-relaxed">Join our growing family of satisfied contractors, builders, and industrialists across Uttar Pradesh.</p>
              </div>
            </div>

            {/* 4 — Support */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                  <circle cx="40" cy="40" r="36" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
                  {/* person head */}
                  <circle cx="40" cy="26" r="10" fill="url(#supp-head)" stroke="#ea580c" strokeWidth="1.5" />
                  {/* shoulders */}
                  <path d="M22 52 C22 42 30 38 40 38 C50 38 58 42 58 52" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
                  {/* headset arc */}
                  <path d="M24 38 A16 16 0 0 1 56 38" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* ear cups */}
                  <rect x="20" y="37" width="7" height="11" rx="3.5" fill="url(#supp-cup)" stroke="#c2410c" strokeWidth="1.2" />
                  <rect x="53" y="37" width="7" height="11" rx="3.5" fill="url(#supp-cup)" stroke="#c2410c" strokeWidth="1.2" />
                  {/* mic */}
                  <path d="M60 46 Q65 50 62 58" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <circle cx="62" cy="58" r="2.5" fill="#f97316" />
                  {/* laptop hint */}
                  <rect x="30" y="55" width="20" height="13" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
                  <rect x="32" y="57" width="16" height="8" rx="1" fill="#fff7ed" />
                  <defs>
                    <linearGradient id="supp-head" x1="30" y1="16" x2="50" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff7ed" />
                      <stop offset="1" stopColor="#fdba74" />
                    </linearGradient>
                    <linearGradient id="supp-cup" x1="20" y1="37" x2="27" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fb923c" />
                      <stop offset="1" stopColor="#c2410c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink mb-1.5">24/7 Customer Support</p>
                <p className="font-body text-xs text-ink/60 leading-relaxed">Our support is as reliable as our steel — available around the clock for every query and order.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3 — Products teaser */}
      <SectionContainer className="gradient-mesh-light">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">What We Offer</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Featured Products</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            From roofing sheets to structural steel — a complete range for construction projects.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.name} className="glow-card rounded-xl overflow-hidden group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-6 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            View All Products
          </Link>
        </div>
      </SectionContainer>

      {/* Section 3.5 — CTA strip + RSG Reliable Partner */}
      {/* Banner strip */}
      <div className="bg-[#f0ebe0] border-b border-[#ddd4be] py-8">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-steel max-w-2xl leading-snug">
            Ready to Transform Your Construction Projects with Premium Roofing &amp; Steel?
          </h2>
          <a
            href="https://wa.me/919918522988?text=Hi%2C%20I%20am%20interested%20in%20getting%20a%20bulk%20quote%20for%20roofing%20and%20steel%20materials."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Bulk Quote
          </a>
        </div>
      </div>
      {/* RSG — Reliable Partner */}
      <section className="bg-white py-16 border-b border-off-white">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink text-center mb-10">
            RSG Profile Manufacturing — Your Reliable Partner
          </h2>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text content */}
            <div className="space-y-5">
              <p className="font-body text-ink/75 text-base leading-relaxed">
                <strong className="font-semibold text-ink">RSG Profile Manufacturing</strong> is a leading{' '}
                <strong className="font-semibold text-ink">bulk manufacturer and wholesaler of roofing sheets and structural steel</strong>{' '}
                at the <strong className="font-semibold text-ink">best wholesale prices</strong>. We manage the entire supply chain
                ourselves — from manufacturing in our Kanpur facility to delivering Pan-UP — giving us complete control over quality
                and cost, so savings pass directly to you.
              </p>
              <p className="font-body text-ink/75 text-base leading-relaxed">
                We are dedicated to sourcing the{' '}
                <strong className="font-semibold text-ink">highest quality raw materials</strong> from authorized mills like
                JSW, Tata BlueScope, and Jindal — and employing precision rolling processes to ensure every sheet meets ISI
                certification standards. Our goal is not just to supply materials, but to build lasting partnerships founded
                on trust, reliability, and consistent quality.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-heading font-semibold text-orange hover:gap-3 transition-all duration-200 text-sm"
                >
                  Learn more about us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-partner.png"
                alt="RSG Profile Manufacturing — Your Reliable Partner"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Client logo strip */}
      <SectionContainer className="bg-white border-t-4 border-t-orange">
        <div className="text-center mb-12">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Brand Partners</p>
          <h2 className="font-heading text-3xl text-ink font-bold mb-3">Our Clients & Partners</h2>
          <p className="font-body text-ink/60 max-w-xl mx-auto">
            Authorized dealer for India's leading steel brands — delivering premium quality at factory prices.
          </p>
        </div>
        {/* Moving logo marquee */}
        <div className="overflow-hidden" aria-label="Partner logos">
          <div className="marquee-track gap-16 items-center">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-14 w-36 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
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

      {/* Section 7 — Testimonials (DARK section) */}
      <section className="gradient-mesh-dark py-24 md:py-32">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="text-center mb-12">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Client Reviews</p>
            <h2 className="font-heading text-3xl lg:text-4xl text-white font-bold mb-4">What Our Clients Say</h2>
            <p className="font-body text-white/55 max-w-xl mx-auto">
              Rated 4.8★ on Google — trusted by contractors and builders across Uttar Pradesh.
            </p>
          </div>

          {/* Rating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {RATINGS.map(r => (
              <div key={r.platform} className="glow-card-dark rounded-xl px-6 py-4 text-center">
                <p className="font-heading text-2xl text-gradient-sunrise font-bold">{r.score}</p>
                <p className="font-body text-sm text-white/55 mt-1">{r.platform} · {r.count}</p>
              </div>
            ))}
          </div>

          {/* Review quotes */}
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glow-card-dark rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-white/80 italic mb-4 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-heading text-sm text-white font-semibold">{t.name}</p>
                  <p className="font-body text-xs text-white/45 mt-0.5">{t.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7.5 — CTA + Quote form split panel */}
      <section className="bg-[#f0ebe0] py-16 md:py-20">
        <div className="mx-auto max-w-container px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

            {/* Left — CTA */}
            <div className="flex flex-col justify-center gap-6 py-4">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-steel leading-snug">
                Get Premium Roofing &amp; Steel at Factory-Direct Wholesale Prices — Across UP.
              </h2>
              <p className="font-heading text-sm font-bold text-ink/70 tracking-widest uppercase">
                Roofing Sheets &nbsp;|&nbsp; Structural Steel &nbsp;|&nbsp; Accessories
              </p>
              <p className="font-body text-ink/65 text-base leading-relaxed">
                Source ISI-certified roofing sheets, MS pipes, purlins, and structural steel directly from our Kanpur manufacturing facility. We supply contractors, builders, and traders across Uttar Pradesh at trade pricing — with delivery in 2–3 days.
              </p>
              <div>
                <a
                  href="https://wa.me/919918522988?text=Hi%2C%20I%20would%20like%20to%20get%20a%20bulk%20quote%20for%20roofing%20and%20steel%20materials."
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
              <HomeQuoteForm />
            </div>

          </div>
        </div>
      </section>

    </>
  );
}

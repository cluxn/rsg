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
    image: '/images/products/colour-coated-roofing-sheet-new.png',
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
    image: '/images/products/crimping-sheet-new.png',
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
  { quote: 'Satisfactory service and behaviour. Very professional team throughout the process.', name: 'Shivkant Dixit', source: 'Google', rating: 5 },
  { quote: 'Extremely professional company with good quality products. Highly recommended for bulk orders.', name: 'Arvind Yadav', source: 'Google', rating: 5 },
  { quote: 'Very nice and good approaching system in this organisation. Staff is very cooperative.', name: 'Vijay Prajapati', source: 'IndiaMART', rating: 4 },
  { quote: 'Best roofing sheet supplier in Kanpur. Quality is excellent and delivery was on time.', name: 'Rakesh Kumar Singh', source: 'Google', rating: 5 },
  { quote: 'We ordered colour coated sheets in bulk. The quality and price both were very good.', name: 'Mohit Agarwal', source: 'Google', rating: 5 },
  { quote: 'Reliable supplier. All products are ISI certified and packaging is very safe.', name: 'Suresh Verma', source: 'IndiaMART', rating: 5 },
  { quote: 'Good quality material at wholesale price. Definitely recommend for bulk construction orders.', name: 'Pradeep Sharma', source: 'Google', rating: 4 },
  { quote: 'Excellent service. Got delivery faster than expected. Will order again for next project.', name: 'Ankit Gupta', source: 'JustDial', rating: 5 },
  { quote: 'Very professional team. Best price for MS pipes in Kanpur region. Highly satisfied.', name: 'Ram Narayan Yadav', source: 'IndiaMART', rating: 5 },
  { quote: 'High quality structural steel at competitive prices. Will definitely order again.', name: 'Santosh Mishra', source: 'Google', rating: 5 },
  { quote: 'Great experience overall. Staff is very helpful and knowledgeable about products.', name: 'Dinesh Tiwari', source: 'JustDial', rating: 5 },
  { quote: 'Good products and fair pricing. Timely delivery appreciated by our construction team.', name: 'Pankaj Jaiswal', source: 'Google', rating: 4 },
  { quote: 'Best in class quality for decking sheets. Very happy with the purchase and service.', name: 'Umesh Chandra', source: 'IndiaMART', rating: 5 },
  { quote: 'One of the best suppliers in UP. Quality never compromises. Trust them completely.', name: 'Vivek Srivastava', source: 'Google', rating: 5 },
  { quote: 'Excellent bulk deal on roofing sheets. Highly recommended to all contractors.', name: 'Ravi Shankar', source: 'JustDial', rating: 5 },
  { quote: 'Very honest and transparent company. Prices are best in market. No hidden charges.', name: 'Narendra Prasad', source: 'Google', rating: 5 },
  { quote: 'Good quality GI sheets at wholesale rate. Satisfied with the overall service.', name: 'Kuldeep Singh', source: 'IndiaMART', rating: 4 },
  { quote: 'RSG is our go-to supplier for all structural steel needs on construction sites.', name: 'Amit Tripathi', source: 'Google', rating: 5 },
  { quote: 'Prompt service and premium quality materials. No complaints at all. Keep it up.', name: 'Devendra Nath', source: 'JustDial', rating: 5 },
  { quote: 'Best wholesale price for roofing sheets in entire UP region. Very fast delivery.', name: 'Manoj Kumar Pandey', source: 'IndiaMART', rating: 5 },
  { quote: 'ISI certified products at factory price. Delivery completed in just 2 days.', name: 'Ajay Rai', source: 'Google', rating: 5 },
  { quote: 'Good supplier with consistent quality. Will continue buying for all future projects.', name: 'Saurabh Kesarwani', source: 'Google', rating: 4 },
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
      <div className="bg-[#f0ebe0] border-b border-[#ddd4be] py-12">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-navy max-w-2xl leading-snug">
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
      <section className="bg-white py-24 md:py-32 border-b border-off-white">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink text-center mb-12">
            Why We&apos;re the Top Suppliers of Roofing Sheets &amp; Structural Steel in UP
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* 1 — ISI Certified */}
            <div className="flex flex-col items-center text-center gap-5 max-w-[220px] mx-auto" data-animate>
              <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 block">
                  {/* sparkle accents */}
                  <path d="M10 30 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fbbf24"/>
                  <path d="M88 68 l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#fdba74"/>
                  <circle cx="90" cy="28" r="5" fill="#fbbf24" opacity="0.75"/>
                  <circle cx="12" cy="76" r="4" fill="#fdba74" opacity="0.9"/>
                  {/* shield — light fill + orange stroke outline */}
                  <path d="M50 13 L82 26 L82 54 C82 76 50 94 50 94 C50 94 18 76 18 54 L18 26 Z" fill="#fff7ed" stroke="#f97316" strokeWidth="3.5" strokeLinejoin="round"/>
                  {/* inner shield highlight band */}
                  <path d="M50 20 L75 31 L75 54 C75 71 50 86 50 86 C50 86 25 71 25 54 L25 31 Z" fill="none" stroke="#fdba74" strokeWidth="1.5" opacity="0.7"/>
                  {/* ISI text in orange */}
                  <text x="50" y="50" textAnchor="middle" fontSize="17" fontWeight="900" fill="#ea580c" fontFamily="Arial, sans-serif" letterSpacing="2">ISI</text>
                  {/* checkmark in orange */}
                  <path d="M35 62 L45 73 L68 48" stroke="#f97316" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-base font-bold text-ink mb-2">100% ISI Certified</p>
                <p className="font-body text-sm text-ink/60 leading-relaxed">Every product manufactured to BIS &amp; ISI standards — no compromise on grade or quality.</p>
              </div>
            </div>

            {/* 2 — Grade Assured */}
            <div className="flex flex-col items-center text-center gap-5 max-w-[220px] mx-auto" data-animate="delay-1">
              <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 block">
                  <circle cx="50" cy="8" r="6.5" fill="#fdba74" opacity="0.7"/>
                  <circle cx="40" cy="4" r="4.5" fill="#fed7aa" opacity="0.6"/>
                  <circle cx="61" cy="5" r="4" fill="#fdba74" opacity="0.55"/>
                  <path d="M40 16 L60 16 L60 36 L40 36 Z" fill="#fdba74"/>
                  <rect x="36" y="11" width="28" height="8" rx="4" fill="#fbbf24"/>
                  <path d="M40 36 L60 36 L82 82 Q79 94 50 94 Q21 94 18 82 Z" fill="#fb923c"/>
                  <path d="M40 36 L60 36 L82 82 Q79 94 50 94 Q21 94 18 82 Z" fill="none" stroke="#ea580c" strokeWidth="2"/>
                  <path d="M34 64 L66 64 L82 82 Q79 94 50 94 Q21 94 18 82 Z" fill="#f97316"/>
                  <path d="M34 64 Q40 59 46 64 Q52 69 58 64 Q62 61 66 64" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <circle cx="36" cy="78" r="6" fill="white" opacity="0.45"/>
                  <circle cx="52" cy="72" r="4.5" fill="white" opacity="0.38"/>
                  <circle cx="64" cy="80" r="4" fill="white" opacity="0.35"/>
                  <line x1="62" y1="45" x2="67" y2="45" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="64" y1="53" x2="69" y2="53" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="62" y1="37" x2="67" y2="37" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="44" y="18" width="5" height="16" rx="2.5" fill="white" opacity="0.3"/>
                  <path d="M46 38 L49 86" stroke="white" strokeWidth="4" opacity="0.22" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-base font-bold text-ink mb-2">100% Grade Assured</p>
                <p className="font-body text-sm text-ink/60 leading-relaxed">All materials sourced from top-tier mills and verified for structural grade quality with strict checks.</p>
              </div>
            </div>

            {/* 3 — Satisfied Clients */}
            <div className="flex flex-col items-center text-center gap-5 max-w-[220px] mx-auto" data-animate="delay-2">
              <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 block">
                  <path d="M22 7 L25 16 L34 16 L27 22 L30 31 L22 25 L14 31 L17 22 L10 16 L19 16 Z" fill="#FFC107"/>
                  <path d="M50 4 L53 13 L62 13 L55 19 L58 28 L50 22 L42 28 L45 19 L38 13 L47 13 Z" fill="#FFC107"/>
                  <path d="M78 7 L81 16 L90 16 L83 22 L86 31 L78 25 L70 31 L73 22 L66 16 L75 16 Z" fill="#FFC107"/>
                  <path d="M5 98 C5 80 12 74 22 74 C32 74 39 80 39 98" fill="#fed7aa"/>
                  <circle cx="22" cy="60" r="13" fill="#fed7aa"/>
                  <path d="M61 98 C61 80 68 74 78 74 C88 74 95 80 95 98" fill="#fb923c"/>
                  <circle cx="78" cy="60" r="13" fill="#fb923c"/>
                  <path d="M30 98 C30 78 38 71 50 71 C62 71 70 78 70 98" fill="#f97316"/>
                  <circle cx="50" cy="55" r="15" fill="#f97316"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-base font-bold text-ink mb-2">525+ Satisfied Clients</p>
                <p className="font-body text-sm text-ink/60 leading-relaxed">Join our growing family of satisfied contractors, builders, and industrialists across Uttar Pradesh.</p>
              </div>
            </div>

            {/* 4 — Support */}
            <div className="flex flex-col items-center text-center gap-5 max-w-[220px] mx-auto" data-animate="delay-3">
              <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 block">
                  <rect x="58" y="4" width="38" height="24" rx="7" fill="#f97316"/>
                  <path d="M64 28 l-5 9 10-4" fill="#f97316"/>
                  <circle cx="67" cy="16" r="3.5" fill="white"/>
                  <circle cx="77" cy="16" r="3.5" fill="white"/>
                  <circle cx="87" cy="16" r="3.5" fill="white"/>
                  <circle cx="36" cy="32" r="18" fill="#fed7aa"/>
                  <path d="M18 29 Q18 11 36 11 Q54 11 54 29 L54 20 Q54 9 36 9 Q18 9 18 20 Z" fill="#c2410c"/>
                  <path d="M16 32 A20 20 0 0 1 56 32" stroke="#7c2d12" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
                  <rect x="10" y="29" width="10" height="17" rx="5" fill="#ea580c"/>
                  <rect x="52" y="29" width="10" height="17" rx="5" fill="#ea580c"/>
                  <path d="M62 42 Q68 47 65 58" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  <circle cx="64" cy="59" r="4.5" fill="#f97316"/>
                  <path d="M10 72 C10 55 20 48 36 48 C52 48 62 55 62 72 L65 94 L8 94 Z" fill="#fb923c"/>
                  <rect x="12" y="74" width="52" height="28" rx="4" fill="#7c2d12" opacity="0.8"/>
                  <rect x="14" y="76" width="48" height="24" rx="3" fill="#fff7ed"/>
                  <line x1="20" y1="83" x2="56" y2="83" stroke="#fdba74" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="20" y1="90" x2="50" y2="90" stroke="#fdba74" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="8" y="101" width="62" height="5" rx="2.5" fill="#ea580c" opacity="0.75"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-base font-bold text-ink mb-2">24/7 Customer Support</p>
                <p className="font-body text-sm text-ink/60 leading-relaxed">Our support is as reliable as our steel — available around the clock for every query and order.</p>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.name} className="glow-card rounded-xl overflow-hidden group flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-heading text-base text-ink font-semibold mb-1.5">{product.name}</h3>
                <p className="font-body text-sm text-ink/60 mb-3 flex-1 line-clamp-2">{product.desc}</p>
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
      {/* Banner strip — dark to break color rhythm after consecutive light sections */}
      <div className="gradient-mesh-dark py-16">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center text-center gap-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white max-w-2xl leading-snug">
            Ready to Transform Your Construction Projects with Premium Roofing &amp; Steel?
          </h2>
          <a
            href="https://wa.me/919918522988?text=Hi%2C%20I%20am%20interested%20in%20getting%20a%20bulk%20quote%20for%20roofing%20and%20steel%20materials."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Free Quote
          </a>
        </div>
      </div>
      {/* RSG — Reliable Partner */}
      <SectionContainer className="bg-white border-b border-off-white">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink text-center mb-10">
            RSG Profile Manufacturing — Your Reliable Partner
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
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
                src="/images/about-partner-products.png"
                alt="RSG Profile Manufacturing — Your Reliable Partner"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
      </SectionContainer>

      {/* Section 6 — Client logo strip */}
      <SectionContainer className="gradient-mesh-light">
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
      <section className="gradient-mesh-dark py-28 md:py-40">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
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

        </div>

        {/* Single scrolling row */}
        <div className="mt-14 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div
            className="overflow-hidden"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
          >
          <div className="marquee-track gap-6" style={{ animationDuration: '120s' }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="glow-card-dark rounded-xl p-6 w-80 flex-shrink-0">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-white/80 italic mb-4 leading-relaxed text-base">"{t.quote}"</p>
                <div>
                  <p className="font-heading text-base text-white font-semibold">{t.name}</p>
                  <p className="font-body text-sm text-white/50 mt-1">{t.source}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Section 7.5 — CTA + Quote form split panel */}
      <section className="bg-[#f0ebe0] py-24 md:py-32">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

            {/* Left — CTA + map */}
            <div className="flex flex-col gap-6 py-4">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-snug">
                Get Premium Roofing &amp; Steel at Factory-Direct Wholesale Prices — Across UP.
              </h2>
              <p className="font-heading text-sm font-bold text-ink/70 tracking-widest uppercase">
                Roofing Sheets &nbsp;|&nbsp; Structural Steel &nbsp;|&nbsp; Accessories
              </p>
              <p className="font-body text-ink/65 text-base leading-relaxed">
                Source ISI-certified roofing sheets, MS pipes, purlins, and structural steel directly from our Kanpur manufacturing facility. We supply contractors, builders, and traders across Uttar Pradesh at trade pricing — with delivery in 2–3 days.
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

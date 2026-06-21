import Link from 'next/link';
import Image from 'next/image';

interface SiteHeaderProps {
  whatsappNumber?: string;
}

export const PPGL_BRANDS = [
  { name: 'JSW Colouron+', slug: 'jsw-colouron' },
  { name: 'JSW Silveron+', slug: 'jsw-silveron' },
  { name: 'JSW Pragati+', slug: 'jsw-pragati' },
  { name: 'JSW Endura+', slug: 'jsw-endura' },
  { name: 'Tata Durashine', slug: 'tata-durashine' },
  { name: 'JINDAL Sabrang', slug: 'jindal-sabrang' },
];

export const PPGI_BRANDS = [
  { name: 'Dura Glow', slug: 'dura-glow' },
  { name: 'AM/NS', slug: 'am-ns' },
];

const PRODUCT_CATEGORIES = [
  { name: 'Decking Sheet', slug: 'decking-sheet', iconPath: 'M3 7h18M3 12h18M3 17h18' },
  { name: 'Galvanized Plain Sheets', slug: 'galvanized-plain-sheets', iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'C and Z Purlins', slug: 'purlins', iconPath: 'M4 5h7M4 9h7M4 13h7M16 5v14M20 5v14' },
  { name: 'Crimping Sheet', slug: 'crimping-sheet', iconPath: 'M6 9c1.5-2 3-2 4.5 0s3 2 4.5 0M6 15c1.5-2 3-2 4.5 0s3 2 4.5 0M3 5h18M3 19h18' },
  { name: 'MS Plate / Channel / Angle', slug: 'ms-plate-channel-angle', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { name: 'Polycarbonate Sheet', slug: 'polycarbonate-sheet', iconPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'MS Pipe', slug: 'ms-pipe', iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
];

function ChevronRight() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const iconCls = 'w-4 h-4 text-orange';

function LayersIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9 5 9-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l9 5 9-5" />
    </svg>
  );
}

function SwatchGridIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5A2.5 2.5 0 0 1 16 14h2a3 3 0 0 0 3-3 9 9 0 0 0-9-8Z" />
      <circle cx="7.5" cy="10.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r=".9" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r=".9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5 11 14.5 15 9.5" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 7-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h5v5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M11 2 12.7 8.3 19 10 12.7 11.7 11 18 9.3 11.7 3 10 9.3 8.3 11 2Z" />
      <circle cx="18.5" cy="17.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function RainbowIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" d="M3 16a9 9 0 0 1 18 0" />
      <path strokeLinecap="round" d="M6.5 16a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}

const BRAND_ICONS: Record<string, () => React.JSX.Element> = {
  'jsw-colouron': PaletteIcon,
  'jsw-silveron': ShieldCheckIcon,
  'jsw-pragati': TrendingUpIcon,
  'jsw-endura': BoltIcon,
  'tata-durashine': SparkleIcon,
  'jindal-sabrang': RainbowIcon,
  'dura-glow': SunIcon,
  'am-ns': GlobeIcon,
};

const dropdownList = 'rounded-md shadow-xl border border-navy/10 bg-white py-2';
const flyout = 'invisible group-hover/products:visible opacity-0 group-hover/products:opacity-100 transition-opacity absolute top-full -left-4 pt-2 w-72 z-50';

export function SiteHeader({ whatsappNumber }: SiteHeaderProps) {
  const waNumber = (whatsappNumber ?? '9918522988').replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${waNumber}`;
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/rsg-logo.png" alt="RSG Profile Manufacturing" width={80} height={60} className="h-14 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">

          {/* 1. Products — mega-menu with flyouts */}
          <div className="group/products relative">
            <span className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1 cursor-default select-none">
              Products
              <ChevronDown />
            </span>
            <div className={flyout}>
              <div className="bg-white rounded-xl shadow-2xl border border-navy/8 p-4">
                <p className="font-body text-[10px] font-semibold tracking-[0.18em] text-navy/40 uppercase mb-3">Roofing &amp; Steel Products</p>
                <div className="flex flex-col gap-0.5">
                  {/* Colour Coated Roofing Sheet — has sub-flyout */}
                  <div className="group/ccrs relative">
                    <Link href="/products/colour-coated-roofing-sheet" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors group">
                      <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
                        </svg>
                      </span>
                      <span className="flex-1 font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Colour Coated Roofing Sheet</span>
                      <ChevronRight />
                    </Link>
                    <div className="invisible group-hover/ccrs:visible opacity-0 group-hover/ccrs:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-60 z-50">
                      <ul className={`${dropdownList} p-2`}>
                        <li className="group/ppgl relative">
                          <span className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors cursor-default">
                            <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                              <LayersIcon />
                            </span>
                            <span className="flex-1 font-heading text-sm font-bold text-navy">PPGL</span>
                            <ChevronRight />
                          </span>
                          <div className="invisible group-hover/ppgl:visible opacity-0 group-hover/ppgl:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-56 z-50">
                            <ul className={`${dropdownList} p-2`}>
                              {PPGL_BRANDS.map((b) => {
                                const BrandIcon = BRAND_ICONS[b.slug] ?? PaletteIcon;
                                return (
                                  <li key={b.slug}>
                                    <Link href={`/products/${b.slug}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors group">
                                      <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                                        <BrandIcon />
                                      </span>
                                      <span className="font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">{b.name}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                        <li className="group/ppgi relative">
                          <span className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors cursor-default">
                            <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                              <SwatchGridIcon />
                            </span>
                            <span className="flex-1 font-heading text-sm font-bold text-navy">PPGI</span>
                            <ChevronRight />
                          </span>
                          <div className="invisible group-hover/ppgi:visible opacity-0 group-hover/ppgi:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-56 z-50">
                            <ul className={`${dropdownList} p-2`}>
                              {PPGI_BRANDS.map((b) => {
                                const BrandIcon = BRAND_ICONS[b.slug] ?? PaletteIcon;
                                return (
                                  <li key={b.slug}>
                                    <Link href={`/products/${b.slug}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors group">
                                      <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                                        <BrandIcon />
                                      </span>
                                      <span className="font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">{b.name}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                        <li>
                          <Link href="/products/accessories" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors group">
                            <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l5.59-5.59a2 2 0 0 0 0-2.82Z" />
                                <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
                              </svg>
                            </span>
                            <span className="font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Accessories</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Other product categories */}
                  {PRODUCT_CATEGORIES.map((c) => (
                    <Link key={c.slug} href={`/products/${c.slug}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange/5 transition-colors group">
                      <span className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
                        </svg>
                      </span>
                      <span className="font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Company — mega menu */}
          <div className="group/work relative">
            <span className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1 cursor-default select-none">
              Company
              <ChevronDown />
            </span>
            <div className="invisible group-hover/work:visible opacity-0 group-hover/work:opacity-100 transition-opacity absolute top-full -left-4 pt-2 z-50 w-[420px]">
              <div className="bg-white rounded-xl shadow-2xl border border-navy/8 p-5">
                <p className="font-body text-[10px] font-semibold tracking-[0.18em] text-navy/40 uppercase mb-4">Our Company</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/about" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors group">
                    <span className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">About RSG</span>
                      <span className="block font-body text-xs text-navy/50 mt-0.5 leading-snug">Who we are, what we make</span>
                    </span>
                  </Link>
                  <Link href="/testimonials" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors group">
                    <span className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Testimonials</span>
                      <span className="block font-body text-xs text-navy/50 mt-0.5 leading-snug">What our clients say</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Resources — mega menu */}
          <div className="group/resources relative">
            <span className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1 cursor-default select-none">
              Resources
              <ChevronDown />
            </span>
            <div className="invisible group-hover/resources:visible opacity-0 group-hover/resources:opacity-100 transition-opacity absolute top-full -left-4 pt-2 z-50 w-[420px]">
              <div className="bg-white rounded-xl shadow-2xl border border-navy/8 p-5">
                <p className="font-body text-[10px] font-semibold tracking-[0.18em] text-navy/40 uppercase mb-4">Resources &amp; Support</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/blog" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors group">
                    <span className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Blog</span>
                      <span className="block font-body text-xs text-navy/50 mt-0.5 leading-snug">Industry tips &amp; insights</span>
                    </span>
                  </Link>
                  <Link href="/events" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors group">
                    <span className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Events</span>
                      <span className="block font-body text-xs text-navy/50 mt-0.5 leading-snug">Trade shows &amp; exhibitions</span>
                    </span>
                  </Link>
                  <Link href="/contact" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors group">
                    <span className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors">Contact Us</span>
                      <span className="block font-body text-xs text-navy/50 mt-0.5 leading-snug">Get a quote or call us</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </nav>

        {/* Get Quote CTA — opens WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange gradient-sunrise text-white shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 border border-transparent px-4 py-2 text-sm"
        >
          Get Free Quote
        </a>

        {/* Mobile menu — CSS-only disclosure */}
        <details className="md:hidden group">
          <summary className="list-none cursor-pointer text-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
            <span className="sr-only">Menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <nav className="absolute top-16 left-0 w-full max-h-[calc(100vh-4rem)] overflow-y-auto bg-navy border-t border-white/10 flex flex-col px-6 py-4 gap-4">

            {/* Products */}
            <details className="group">
              <summary className="list-none cursor-pointer font-body text-white/80 hover:text-white transition-colors flex items-center justify-between">
                Products
                <ChevronDown />
              </summary>
              <div className="pl-4 mt-2 flex flex-col gap-3">
                <details className="group">
                  <summary className="list-none cursor-pointer font-body text-white text-sm flex items-center justify-between">
                    Colour Coated Roofing Sheet
                    <ChevronDown />
                  </summary>
                  <div className="pl-4 mt-2 flex flex-col gap-3">
                    <details className="group">
                      <summary className="list-none cursor-pointer font-body text-white/90 text-sm flex items-center justify-between">
                        PPGL
                        <ChevronDown />
                      </summary>
                      <div className="pl-4 mt-2 flex flex-col gap-2">
                        {PPGL_BRANDS.map((b) => (
                          <Link key={b.slug} href={`/products/${b.slug}`} className="font-body text-white/70 text-sm">{b.name}</Link>
                        ))}
                      </div>
                    </details>
                    <details className="group">
                      <summary className="list-none cursor-pointer font-body text-white/90 text-sm flex items-center justify-between">
                        PPGI
                        <ChevronDown />
                      </summary>
                      <div className="pl-4 mt-2 flex flex-col gap-2">
                        {PPGI_BRANDS.map((b) => (
                          <Link key={b.slug} href={`/products/${b.slug}`} className="font-body text-white/70 text-sm">{b.name}</Link>
                        ))}
                      </div>
                    </details>
                    <Link href="/products/accessories" className="font-body text-white/90 text-sm">Accessories</Link>
                  </div>
                </details>
                {PRODUCT_CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/products/${c.slug}`} className="font-body text-white text-sm">{c.name}</Link>
                ))}
              </div>
            </details>

            {/* Company */}
            <details className="group">
              <summary className="list-none cursor-pointer font-body text-white/80 hover:text-white transition-colors flex items-center justify-between">
                Company
                <ChevronDown />
              </summary>
              <div className="pl-4 mt-2 flex flex-col gap-3">
                <Link href="/about" className="font-body text-white text-sm">About</Link>
                <Link href="/testimonials" className="font-body text-white text-sm">Testimonials</Link>
              </div>
            </details>

            {/* Resources */}
            <details className="group">
              <summary className="list-none cursor-pointer font-body text-white/80 hover:text-white transition-colors flex items-center justify-between">
                Resources
                <ChevronDown />
              </summary>
              <div className="pl-4 mt-2 flex flex-col gap-3">
                <Link href="/blog" className="font-body text-white text-sm">Blogs</Link>
                <Link href="/events" className="font-body text-white text-sm">Events</Link>
                <Link href="/contact" className="font-body text-white text-sm">Contact Us</Link>
              </div>
            </details>

          </nav>
        </details>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';

interface SiteHeaderProps {
  whatsappNumber?: string;
}

const PPGL_BRANDS = [
  { name: 'JSW Colouron+', slug: 'jsw-colouron' },
  { name: 'JSW Silveron+', slug: 'jsw-silveron' },
  { name: 'JSW Pragati+', slug: 'jsw-pragati' },
  { name: 'JSW Endura+', slug: 'jsw-endura' },
  { name: 'Tata Durashine', slug: 'tata-durashine' },
  { name: 'JINDAL Sabrang', slug: 'jindal-sabrang' },
];

const PPGI_BRANDS = [
  { name: 'Dura Glow', slug: 'dura-glow' },
  { name: 'AM/NS', slug: 'am-ns' },
];

const PRODUCT_CATEGORIES = [
  { name: 'Decking Sheet', slug: 'decking-sheet' },
  { name: 'Galvanized Plain Sheets', slug: 'galvanized-plain-sheets' },
  { name: 'C and Z Purlins', slug: 'purlins' },
  { name: 'Crimping Sheet', slug: 'crimping-sheet' },
  { name: 'MS Plate / Channel / Angle', slug: 'ms-plate-channel-angle' },
  { name: 'Polycarbonate Sheet', slug: 'polycarbonate-sheet' },
  { name: 'MS Pipe', slug: 'ms-pipe' },
];

function ChevronDown() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const dropdownItem = 'block px-4 py-2 text-sm font-body text-navy hover:bg-steel/10 transition-colors';
const dropdownList = 'rounded-md shadow-xl border border-navy/10 bg-white py-2';
const flyout = 'invisible group-hover/products:visible opacity-0 group-hover/products:opacity-100 transition-opacity absolute top-full left-0 pt-1 w-64 z-50';

export function SiteHeader({ whatsappNumber }: SiteHeaderProps) {
  const waNumber = (whatsappNumber ?? '9918522988').replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${waNumber}`;
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto max-w-container px-6 sm:px-8 md:px-16 lg:px-20 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/rsg-logo.png" alt="RSG Profile Manufacturing" width={80} height={60} className="h-14 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">

          {/* 1. Products — dropdown */}
          <div className="group/products relative">
            <Link href="/products" className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1">
              Products
              <ChevronDown />
            </Link>
            <div className={flyout}>
              <ul className={dropdownList}>
                {/* CCRS section — label only, no link */}
                <li>
                  <span className="block px-4 pt-3 pb-1 text-xs font-heading font-semibold text-navy/40 uppercase tracking-widest">
                    Colour Coated Roofing Sheet
                  </span>
                </li>
                <li>
                  <span className="block px-4 pb-1 text-xs font-body text-navy/30 uppercase tracking-widest">PPGL</span>
                </li>
                {PPGL_BRANDS.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/products/${b.slug}`} className={dropdownItem + ' pl-6'}>{b.name}</Link>
                  </li>
                ))}
                <li>
                  <span className="block px-4 pt-2 pb-1 text-xs font-body text-navy/30 uppercase tracking-widest">PPGI</span>
                </li>
                {PPGI_BRANDS.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/products/${b.slug}`} className={dropdownItem + ' pl-6'}>{b.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/products/accessories" className={dropdownItem + ' pl-6'}>Accessories</Link>
                </li>
                <li className="border-t border-navy/10 my-1" aria-hidden="true" />
                {PRODUCT_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products/${c.slug}`} className={dropdownItem}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Work — dropdown: About, Testimonials */}
          <div className="group/work relative">
            <span className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1 cursor-default select-none">
              Work
              <ChevronDown />
            </span>
            <div className="invisible group-hover/work:visible opacity-0 group-hover/work:opacity-100 transition-opacity absolute top-full left-0 pt-1 w-44 z-50">
              <ul className={dropdownList}>
                <li><Link href="/about" className={dropdownItem}>About</Link></li>
                <li><Link href="/testimonials" className={dropdownItem}>Testimonials</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Resources — dropdown: Blogs, Guide, Events, Contact Us */}
          <div className="group/resources relative">
            <span className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1 cursor-default select-none">
              Resources
              <ChevronDown />
            </span>
            <div className="invisible group-hover/resources:visible opacity-0 group-hover/resources:opacity-100 transition-opacity absolute top-full left-0 pt-1 w-44 z-50">
              <ul className={dropdownList}>
                <li><Link href="/blog" className={dropdownItem}>Blogs</Link></li>
                <li><Link href="/events" className={dropdownItem}>Events</Link></li>
                <li><Link href="/contact" className={dropdownItem}>Contact Us</Link></li>
              </ul>
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
          Get Quote
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
                {/* CCRS — label + flat list, no link */}
                <div className="flex flex-col gap-2">
                  <p className="font-body text-white/40 text-xs uppercase tracking-widest">Colour Coated Roofing Sheet</p>
                  <p className="font-body text-white/30 text-xs uppercase tracking-widest pl-2">PPGL</p>
                  {PPGL_BRANDS.map((b) => (
                    <Link key={b.slug} href={`/products/${b.slug}`} className="font-body text-white/70 text-sm pl-4">{b.name}</Link>
                  ))}
                  <p className="font-body text-white/30 text-xs uppercase tracking-widest pl-2">PPGI</p>
                  {PPGI_BRANDS.map((b) => (
                    <Link key={b.slug} href={`/products/${b.slug}`} className="font-body text-white/70 text-sm pl-4">{b.name}</Link>
                  ))}
                  <Link href="/products/accessories" className="font-body text-white/70 text-sm pl-4">Accessories</Link>
                </div>
                <div className="border-t border-white/10" />
                {PRODUCT_CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/products/${c.slug}`} className="font-body text-white text-sm">{c.name}</Link>
                ))}
              </div>
            </details>

            {/* Work */}
            <details className="group">
              <summary className="list-none cursor-pointer font-body text-white/80 hover:text-white transition-colors flex items-center justify-between">
                Work
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

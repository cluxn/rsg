import Link from 'next/link';
import Image from 'next/image';

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

const dropdownItem = 'block px-4 py-2 text-sm font-body text-navy hover:bg-steel/10 transition-colors';
const dropdownList = 'rounded-md shadow-xl border border-navy/10 bg-white py-2';
const flyout = 'invisible group-hover/products:visible opacity-0 group-hover/products:opacity-100 transition-opacity absolute top-full left-0 pt-1 w-64 z-50';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto max-w-container px-6 md:px-16 lg:px-20 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/rsg-logo.png" alt="RSG Profile Manufacturing" width={80} height={60} className="h-14 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">

          {/* 1. Products — mega-menu with flyouts */}
          <div className="group/products relative">
            <Link href="/products" className="font-body text-sm text-white/80 hover:text-white transition-colors py-4 inline-flex items-center gap-1">
              Products
              <ChevronDown />
            </Link>
            <div className={flyout}>
              <ul className={dropdownList}>
                <li className="group/ccrs relative">
                  <Link href="/products/colour-coated-roofing-sheet" className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-body text-navy hover:bg-steel/10 transition-colors">
                    Colour Coated Roofing Sheet
                    <ChevronRight />
                  </Link>
                  <div className="invisible group-hover/ccrs:visible opacity-0 group-hover/ccrs:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-56 z-50">
                    <ul className={dropdownList}>
                      <li className="group/ppgl relative">
                        <span className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-body text-navy hover:bg-steel/10 transition-colors cursor-default">
                          PPGL
                          <ChevronRight />
                        </span>
                        <div className="invisible group-hover/ppgl:visible opacity-0 group-hover/ppgl:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-52 z-50">
                          <ul className={dropdownList}>
                            {PPGL_BRANDS.map((b) => (
                              <li key={b.slug}>
                                <Link href={`/products/${b.slug}`} className={dropdownItem}>{b.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                      <li className="group/ppgi relative">
                        <span className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-body text-navy hover:bg-steel/10 transition-colors cursor-default">
                          PPGI
                          <ChevronRight />
                        </span>
                        <div className="invisible group-hover/ppgi:visible opacity-0 group-hover/ppgi:opacity-100 transition-opacity absolute left-full top-0 pl-1 w-52 z-50">
                          <ul className={dropdownList}>
                            {PPGI_BRANDS.map((b) => (
                              <li key={b.slug}>
                                <Link href={`/products/${b.slug}`} className={dropdownItem}>{b.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                      <li>
                        <Link href="/products/accessories" className={dropdownItem}>Accessories</Link>
                      </li>
                    </ul>
                  </div>
                </li>
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
                <li><Link href="/guide" className={dropdownItem}>Guide</Link></li>
                <li><Link href="/events" className={dropdownItem}>Events</Link></li>
                <li><Link href="/contact" className={dropdownItem}>Contact Us</Link></li>
              </ul>
            </div>
          </div>

        </nav>

        {/* Get Quote CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange gradient-sunrise text-white shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 border border-transparent px-4 py-2 text-sm"
        >
          Get Quote
        </Link>

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
                <Link href="/guide" className="font-body text-white text-sm">Guide</Link>
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

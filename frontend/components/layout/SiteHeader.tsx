import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto max-w-container px-6 md:px-16 lg:px-20 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading font-bold text-white text-xl">RSG</span>
          <span className="hidden md:inline font-body text-white/60 text-sm">Profile Manufacturing</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-body text-sm text-white/80 hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="font-body text-sm text-white/80 hover:text-white transition-colors">About</Link>
          <Link href="/products" className="font-body text-sm text-white/80 hover:text-white transition-colors">Products</Link>
          <Link href="/contact" className="font-body text-sm text-white/80 hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange bg-orange text-white hover:bg-orange/90 border border-orange px-4 py-2 text-sm"
        >
          Get Quote
        </Link>

        {/* Mobile menu — CSS-only disclosure */}
        <details className="md:hidden group">
          <summary className="list-none cursor-pointer text-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
            <span className="sr-only">Menu</span>
            {/* Hamburger */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <nav className="absolute top-16 left-0 w-full bg-navy border-t border-white/10 flex flex-col px-6 py-4 gap-4">
            <Link href="/" className="font-body text-white/80 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="font-body text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="/products" className="font-body text-white/80 hover:text-white transition-colors">Products</Link>
            <Link href="/contact" className="font-body text-white/80 hover:text-white transition-colors">Contact</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';

const FOOTER_PRODUCTS = [
  { name: 'Colour Coated Roofing Sheet', slug: 'colour-coated-roofing-sheet' },
  { name: 'MS Plate, Channel & Angle', slug: 'ms-plate-channel-angle' },
  { name: 'MS Pipe', slug: 'ms-pipe' },
  { name: 'Decking Sheet', slug: 'decking-sheet' },
  { name: 'C and Z Purlins', slug: 'purlins' },
  { name: 'Polycarbonate Sheet', slug: 'polycarbonate-sheet' },
  { name: 'Crimping Sheet', slug: 'crimping-sheet' },
  { name: 'Galvanized Plain Sheets', slug: 'galvanized-plain-sheets' },
];

const linkCls = 'font-body text-sm text-white/70 hover:text-white transition-colors';

interface SiteFooterProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
}

export function SiteFooter({ address, phone, email, hours }: SiteFooterProps) {
  const displayAddress = address || '53-A, Industrial Estate, Dada Nagar, Kanpur, UP 208022';
  const displayPhone   = phone   || '+91-9918522988';
  const displayEmail   = email   || 'shivamgupta@rsgprofilesheets.com';
  const displayHours   = hours   || 'Mon–Sat 10 AM – 6 PM';

  return (
    <footer className="bg-navy text-white/80">
      {/* Top row */}
      <div className="py-10">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1: Brand + social */}
          <div className="lg:col-span-1">
            <Image src="/rsg-logo.png" alt="RSG Profile Manufacturing" width={80} height={60} className="h-14 w-auto mb-3" />
            <p className="font-heading font-bold text-white text-lg mb-1">RSG Profile Manufacturing</p>
            <p className="font-body text-white/60 text-sm mb-4">Premium quality building materials, Kanpur</p>

            {/* Social icons */}
            <div className="flex gap-4">
              <a href="https://www.instagram.com/rsgprofile/" target="_blank" rel="noopener noreferrer" aria-label="RSG on Instagram" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://in.linkedin.com/company/rsg-profile-manufacturing-private-limited" target="_blank" rel="noopener noreferrer" aria-label="RSG on LinkedIn" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/rsgprofiles" target="_blank" rel="noopener noreferrer" aria-label="RSG on Facebook" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Our Products */}
          <nav className="flex flex-col gap-2">
            <p className="font-heading text-white text-sm font-semibold mb-1">Our Products</p>
            {FOOTER_PRODUCTS.map(p => (
              <Link key={p.slug} href={`/products/${p.slug}`} className={linkCls}>
                {p.name}
              </Link>
            ))}
          </nav>

          {/* Col 3: Company */}
          <nav className="flex flex-col gap-2">
            <p className="font-heading text-white text-sm font-semibold mb-1">Company</p>
            <Link href="/about" className={linkCls}>About</Link>
            <Link href="/testimonials" className={linkCls}>Testimonials</Link>
          </nav>

          {/* Col 4: Resources */}
          <nav className="flex flex-col gap-2">
            <p className="font-heading text-white text-sm font-semibold mb-1">Resources</p>
            <Link href="/blog" className={linkCls}>Blogs</Link>
            <Link href="/events" className={linkCls}>Events</Link>
            <Link href="/contact" className={linkCls}>Contact Us</Link>
          </nav>

          {/* Col 5: Contact details */}
          <address className="not-italic flex flex-col gap-3">
            <p className="font-heading text-white text-sm font-semibold">Contact</p>
            <p className="font-body text-white/70 text-sm flex gap-2">
              <svg className="w-4 h-4 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{displayAddress}</span>
            </p>
            <p className="font-body text-white/70 text-sm flex gap-2 items-center">
              <svg className="w-4 h-4 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{displayPhone}</a>
            </p>
            <p className="font-body text-white/70 text-sm flex gap-2 items-center">
              <svg className="w-4 h-4 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${displayEmail}`} className="hover:text-white transition-colors">{displayEmail}</a>
            </p>
            <p className="font-body text-white/60 text-xs ml-6">{displayHours}</p>
          </address>

        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/10 py-4">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/50">
            © 2026 RSG Profile Manufacturing Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="font-body text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/20">·</span>
            <Link href="/terms-and-conditions" className="font-body text-xs text-white/50 hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
          <p className="font-body text-xs text-white/50">
            Developed and managed by{' '}
            <a href="https://buildera.co/" target="_blank" rel="noopener" className="text-white/70 hover:text-white transition-colors underline">
              Buildera Technologies LLP
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

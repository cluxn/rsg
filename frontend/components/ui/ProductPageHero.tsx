'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/api';

const PRODUCT_OPTIONS = [
  'Colour Coated Roofing Sheet',
  'MS Pipe',
  'Decking Sheet',
  'C and Z Purlins',
  'Polycarbonate Sheet',
  'Galvanized Plain Sheets',
  'MS Plate, Channel & Angle',
  'Crimping Sheet',
  'Accessories',
  'General Inquiry',
];

const FALLBACK_BG: Record<string, string> = {
  'colour-coated-roofing-sheet': '/images/products/colour-coated-roofing-sheet.jpg',
  'ms-pipe': '/images/products/ms-pipe.jpg',
  'decking-sheet': '/images/products/decking-sheet-hq.png',
  'purlins': '/images/products/purlins.webp',
  'galvanized-plain-sheets': '/images/products/galvanized-plain-sheets.jpg',
  'polycarbonate-sheet': '/images/products/polycarbonate-sheet.jpg',
};

interface ProductPageHeroProps {
  product: Pick<Product, 'name' | 'slug' | 'description' | 'media'>;
}

export function ProductPageHero({ product }: ProductPageHeroProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bgUrl = product.media[0]?.url ?? FALLBACK_BG[product.slug] ?? '/images/hero/industrial-bg.webp';
  const desc = product.description
    ? product.description.length > 180
      ? product.description.slice(0, 180) + '…'
      : product.description
    : null;

  const preselected = PRODUCT_OPTIONS.includes(product.name) ? product.name : PRODUCT_OPTIONS[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source_page: `product/${product.slug}`,
          _hp: '',
        }),
      });
      if (res.status === 429) {
        setError('Too many requests — please try again later.');
      } else if (!res.ok) {
        setError('Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative gradient-power overflow-hidden">
      {/* Background image with dark left-to-right overlay */}
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

            {/* Left — content */}
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
                Get Quote
              </a>
            </div>

            {/* Right — quote form (white card, matching homepage style) */}
            <div id="product-hero-form" className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-heading text-ink text-lg font-semibold">Thank you!</p>
                  <p className="font-body text-ink/70 text-sm mt-1">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-ink text-xl font-bold mb-1">Get a Free Quote</h2>
                  <p className="font-body text-ink/50 text-sm mb-5">
                    Fill in your details — we respond within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
                    <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                    <div>
                      <label htmlFor="pph-name" className="block font-body text-sm font-semibold text-navy mb-1">
                        Full Name *
                      </label>
                      <input
                        id="pph-name"
                        name="name"
                        type="text"
                        required
                        className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="pph-phone" className="block font-body text-sm font-semibold text-navy mb-1">
                          Phone
                        </label>
                        <input
                          id="pph-phone"
                          name="phone"
                          type="tel"
                          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80"
                        />
                      </div>
                      <div>
                        <label htmlFor="pph-email" className="block font-body text-sm font-semibold text-navy mb-1">
                          Email
                        </label>
                        <input
                          id="pph-email"
                          name="email"
                          type="email"
                          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pph-product" className="block font-body text-sm font-semibold text-navy mb-1">
                        Product Interest
                      </label>
                      <select
                        id="pph-product"
                        name="product_interest"
                        defaultValue={preselected}
                        className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80"
                      >
                        {PRODUCT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pph-message" className="block font-body text-sm font-semibold text-navy mb-1">
                        Message
                      </label>
                      <textarea
                        id="pph-message"
                        name="message"
                        rows={3}
                        className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80 resize-none"
                      />
                    </div>

                    {error && (
                      <p role="alert" className="font-body text-red-600 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full gradient-sunrise rounded-lg px-6 py-3 font-heading font-semibold text-white text-base shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-200"
                    >
                      {loading ? 'Sending…' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

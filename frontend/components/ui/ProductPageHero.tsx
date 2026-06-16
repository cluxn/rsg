'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/api';

interface ProductPageHeroProps {
  product: Pick<Product, 'name' | 'slug' | 'description' | 'media'>;
}

export function ProductPageHero({ product }: ProductPageHeroProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bgImage = product.media[0] ?? null;
  const desc = product.description
    ? product.description.length > 160
      ? product.description.slice(0, 160) + '…'
      : product.description
    : null;

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
          product_interest: product.name,
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
      {/* Background: product image (blurred, dark-overlaid) */}
      {bgImage && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image
            src={bgImage.url}
            alt=""
            fill
            priority
            className="object-cover opacity-[0.22] blur-[2px] scale-105"
          />
          {/* Left-heavy overlay so left content is fully legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/45" />
          {/* Subtle top & bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/50" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-8 md:px-16 lg:px-20 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

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
              href="#specs-section"
              className="inline-flex items-center gap-2 font-heading font-semibold text-white border-2 border-white/25 hover:border-cyan/60 hover:text-cyan rounded-lg px-7 py-3 transition-all duration-200"
            >
              View Specifications <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Right — quote form (glassmorphism card) */}
          <div className="glass-panel rounded-2xl p-6 lg:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-white text-lg font-semibold mb-2">Enquiry Sent!</h3>
                <p className="font-body text-white/60 text-sm">
                  We&apos;ll get back to you about {product.name} within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-white text-xl font-semibold mb-1">Get a Free Quote</h2>
                <p className="font-body text-white/50 text-sm mb-6">
                  Fill in your details and we&apos;ll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot */}
                  <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div>
                    <label htmlFor="pph-name" className="block font-body text-xs text-white/55 uppercase tracking-wide mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="pph-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Rajesh Kumar"
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan/60 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="pph-phone" className="block font-body text-xs text-white/55 uppercase tracking-wide mb-1.5">
                      Phone
                    </label>
                    <input
                      id="pph-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan/60 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="pph-email" className="block font-body text-xs text-white/55 uppercase tracking-wide mb-1.5">
                      Email
                    </label>
                    <input
                      id="pph-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan/60 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="pph-message" className="block font-body text-xs text-white/55 uppercase tracking-wide mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="pph-message"
                      name="message"
                      rows={3}
                      placeholder={`Tell us your requirement for ${product.name}…`}
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan/60 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="font-body text-red-400 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-sunrise rounded-lg px-6 py-3 font-heading font-semibold text-white text-base shadow-glow-orange hover:opacity-90 disabled:opacity-60 transition-opacity duration-200"
                  >
                    {loading ? 'Sending…' : 'Send Enquiry →'}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

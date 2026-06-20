'use client';

import { useState } from 'react';
import { CTAButton } from './CTAButton';
import { SectionContainer } from '@/components/layout/SectionContainer';

interface GetQuoteCTAProps {
  productName: string;
  slug: string;
}

export function GetQuoteCTA({ productName, slug }: GetQuoteCTAProps) {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          product_interest: productName,
          source_page: `product/${slug}`,
          _hp: '',
        }),
      });
      if (res.status === 429) {
        setError('Too many requests — please try again later.');
      } else if (!res.ok) {
        setError('Something went wrong. Please try again or contact us directly.');
      } else {
        setSubmitted(true);
        setExpanded(false);
      }
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="get-quote-section" className="w-full bg-navy py-16 lg:py-20">
      <SectionContainer noPadding className="text-center">
        <h2 className="font-heading text-white text-2xl lg:text-3xl font-semibold mb-3">
          Interested in {productName}?
        </h2>
        <p className="font-body text-white/70 text-lg mb-8">
          Get a custom quote tailored to your requirements.
        </p>

        {submitted ? (
          <p className="font-body text-green-300 text-base">
            Thank you! We&apos;ll contact you about {productName} shortly.
          </p>
        ) : (
          <>
            {!expanded && (
              <CTAButton variant="primary" size="lg" type="button" onClick={() => setExpanded(true)}>
                Get Free Quote
              </CTAButton>
            )}

            {expanded && (
              <div className="max-w-md mx-auto mt-4 bg-white border border-navy/10 rounded-lg p-6 text-left">
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot */}
                  <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div>
                    <label htmlFor="gqcta-name" className="block font-body text-sm text-navy/70 mb-1">Your Name *</label>
                    <input id="gqcta-name" name="name" type="text" required
                      className="w-full border border-navy/20 rounded px-3 py-2 font-body text-sm text-navy focus:border-steel focus:outline-none" />
                  </div>

                  <div>
                    <label htmlFor="gqcta-phone" className="block font-body text-sm text-navy/70 mb-1">Phone</label>
                    <input id="gqcta-phone" name="phone" type="tel"
                      className="w-full border border-navy/20 rounded px-3 py-2 font-body text-sm text-navy focus:border-steel focus:outline-none" />
                  </div>

                  <div>
                    <label htmlFor="gqcta-email" className="block font-body text-sm text-navy/70 mb-1">Email</label>
                    <input id="gqcta-email" name="email" type="email"
                      className="w-full border border-navy/20 rounded px-3 py-2 font-body text-sm text-navy focus:border-steel focus:outline-none" />
                  </div>

                  <div>
                    <label htmlFor="gqcta-message" className="block font-body text-sm text-navy/70 mb-1">Message (optional)</label>
                    <textarea id="gqcta-message" name="message" rows={3}
                      className="w-full border border-navy/20 rounded px-3 py-2 font-body text-sm text-navy focus:border-steel focus:outline-none resize-none" />
                  </div>

                  {error && <p role="alert" className="font-body text-red-600 text-sm">{error}</p>}

                  <div className="flex gap-3">
                    <CTAButton type="submit" variant="primary" size="md" disabled={loading} className="flex-1 justify-center">
                      {loading ? 'Sending…' : 'Get Free Quote'}
                    </CTAButton>
                    <button
                      type="button"
                      onClick={() => setExpanded(false)}
                      className="font-body text-sm text-navy/50 hover:text-navy/80 px-3"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </SectionContainer>
    </section>
  );
}

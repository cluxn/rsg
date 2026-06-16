'use client';

import { useState } from 'react';
import { CTAButton } from '@/components/ui/CTAButton';

const PRODUCT_OPTIONS = [
  'General Inquiry',
  'Colour Coated Roofing Sheet',
  'MS Plate, Channel & Angle',
  'MS Pipe',
  'Decking Sheet',
  'Purlins',
  'Polycarbonate Sheet',
  'Crimping Sheet',
  'Accessories',
];

export default function HomeQuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-heading text-ink text-lg font-semibold">Thank you!</p>
        <p className="font-body text-ink/70 text-sm mt-1">We&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

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
        body: JSON.stringify({ ...data, source_page: 'home', _hp: '' }),
      });
      if (res.status === 429) {
        setError('Too many requests — please try again in a few minutes.');
      } else if (!res.ok) {
        setError('Something went wrong. Please WhatsApp us or call directly.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please WhatsApp us or call directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      {/* Honeypot — filled by bots, ignored by real users */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="hqf-name" className="block font-body text-sm font-semibold text-navy mb-1">Full Name *</label>
        <input id="hqf-name" name="name" type="text" required
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="hqf-phone" className="block font-body text-sm font-semibold text-navy mb-1">Phone</label>
          <input id="hqf-phone" name="phone" type="tel"
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80" />
        </div>
        <div>
          <label htmlFor="hqf-email" className="block font-body text-sm font-semibold text-navy mb-1">Email</label>
          <input id="hqf-email" name="email" type="email"
            className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80" />
        </div>
      </div>

      <div>
        <label htmlFor="hqf-product" className="block font-body text-sm font-semibold text-navy mb-1">Product Interest</label>
        <select id="hqf-product" name="product_interest"
          className="w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white/80">
          {PRODUCT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="font-body text-red-600 text-sm">{error}</p>}

      <CTAButton type="submit" variant="primary" size="md" disabled={loading} className="w-full justify-center">
        {loading ? 'Sending…' : 'Send Enquiry'}
      </CTAButton>
    </form>
  );
}

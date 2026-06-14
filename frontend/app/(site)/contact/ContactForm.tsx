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
  'Self Drilling Screws',
  'Turbo Air Ventilator',
  'Accessories',
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-navy mb-2">Thank you!</h3>
        <p className="font-body text-navy/70">We&apos;ll be in touch within 24 hours.</p>
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
        body: JSON.stringify({ ...data, source_page: 'contact' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <h2 className="font-heading text-2xl text-navy">Send an Enquiry</h2>

      <div>
        <label htmlFor="name" className="block font-body text-sm font-semibold text-navy mb-1">Full Name *</label>
        <input id="name" name="name" type="text" required
          className="w-full border border-navy/20 rounded-lg px-4 py-3 font-body text-navy focus:outline-none focus:ring-2 focus:ring-steel/50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block font-body text-sm font-semibold text-navy mb-1">Phone</label>
          <input id="phone" name="phone" type="tel"
            className="w-full border border-navy/20 rounded-lg px-4 py-3 font-body text-navy focus:outline-none focus:ring-2 focus:ring-steel/50" />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-semibold text-navy mb-1">Email</label>
          <input id="email" name="email" type="email"
            className="w-full border border-navy/20 rounded-lg px-4 py-3 font-body text-navy focus:outline-none focus:ring-2 focus:ring-steel/50" />
        </div>
      </div>

      <div>
        <label htmlFor="product_interest" className="block font-body text-sm font-semibold text-navy mb-1">Product Interest</label>
        <select id="product_interest" name="product_interest"
          className="w-full border border-navy/20 rounded-lg px-4 py-3 font-body text-navy focus:outline-none focus:ring-2 focus:ring-steel/50 bg-white">
          {PRODUCT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block font-body text-sm font-semibold text-navy mb-1">Message</label>
        <textarea id="message" name="message" rows={4}
          className="w-full border border-navy/20 rounded-lg px-4 py-3 font-body text-navy focus:outline-none focus:ring-2 focus:ring-steel/50 resize-none" />
      </div>

      {error && <p role="alert" className="font-body text-red-600 text-sm">{error}</p>}

      <CTAButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
        {loading ? 'Sending…' : 'Send Enquiry'}
      </CTAButton>
    </form>
  );
}

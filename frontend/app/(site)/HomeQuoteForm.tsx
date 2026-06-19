'use client';

import { useState } from 'react';

const inputClass =
  'w-full border border-navy/20 rounded-lg px-4 py-2.5 font-body text-navy text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-steel/40 bg-white/80';

const labelClass = 'block font-body text-sm font-semibold text-navy mb-1';

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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Row 1 — Name + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="hqf-name" className={labelClass}>
            Name <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-name" name="name" type="text" required
            placeholder="Enter your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hqf-email" className={labelClass}>
            Email <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-email" name="email" type="email" required
            placeholder="Enter your email"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 2 — Phone + Product */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="hqf-phone" className={labelClass}>
            Phone Number <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-phone" name="phone" type="tel" required
            placeholder="Enter your phone number"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hqf-product" className={labelClass}>
            Product <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-product" name="product_interest" type="text" required
            placeholder="Enter product name"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3 — City + Country */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="hqf-city" className={labelClass}>
            City <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-city" name="city" type="text" required
            placeholder="Enter your city"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hqf-state" className={labelClass}>
            State <span className="text-orange">*</span>
          </label>
          <input
            id="hqf-state" name="state" type="text" required
            placeholder="Enter your state"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 4 — Message */}
      <div>
        <label htmlFor="hqf-message" className={labelClass}>Message</label>
        <textarea
          id="hqf-message" name="message" rows={4}
          placeholder="Enter your message"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p role="alert" className="font-body text-red-600 text-sm">{error}</p>}

      {/* Submit */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          disabled={loading}
          className="font-heading font-semibold text-white gradient-sunrise rounded-lg px-10 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-200"
        >
          {loading ? 'Sending…' : 'GET QUOTE'}
        </button>
      </div>
    </form>
  );
}

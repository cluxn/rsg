'use client';

import { useState } from 'react';

const PRODUCT_OPTIONS = [
  'Colour Coated Roofing Sheet',
  'Galvanized Plain Sheets',
  'Decking Sheet',
  'C and Z Purlins',
  'MS Pipe',
  'Polycarbonate Sheet',
  'General Inquiry',
];

interface BlogLeadFormProps {
  sourcePage?: string;
}

const inp = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:ring-1 focus:ring-steel bg-white';

export function BlogLeadForm({ sourcePage = 'blog' }: BlogLeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-heading text-navy text-base font-semibold">Thank you!</p>
        <p className="font-body text-navy/60 text-xs mt-1">We&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

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
        body: JSON.stringify({ ...data, source_page: sourcePage, _hp: '' }),
      });
      if (res.status === 429) {
        setError('Too many requests — try again shortly.');
      } else if (!res.ok) {
        setError('Something went wrong. Please call us directly.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-navy rounded-2xl p-5">
      <p className="font-heading text-white text-base font-bold mb-1">Get a Free Quote</p>
      <p className="font-body text-white/60 text-xs mb-4">Tell us your requirement and we&apos;ll respond within 24 hours.</p>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />
        <input name="name" type="text" required placeholder="Your name *" className={inp} />
        <input name="phone" type="tel" required placeholder="Phone number *" className={inp} />
        <input name="email" type="email" placeholder="Email (optional)" className={inp} />
        <select name="product_interest" required className={inp} defaultValue="">
          <option value="" disabled>Select product *</option>
          {PRODUCT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <textarea name="message" rows={3} placeholder="Message (optional)" className={`${inp} resize-none`} />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full font-heading font-semibold text-white gradient-sunrise rounded-lg py-2.5 text-sm hover:shadow-glow-orange disabled:opacity-60 transition-all duration-200"
        >
          {loading ? 'Sending…' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  );
}

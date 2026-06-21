'use client';

import { useState } from 'react';

interface EventRegistrationFormProps {
  eventTitle: string;
  eventSlug: string;
}

const inp = 'w-full border border-navy/20 rounded-lg px-3 py-2.5 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:ring-1 focus:ring-orange bg-white transition-colors';

export function EventRegistrationForm({ eventTitle, eventSlug }: EventRegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center py-10 text-center border border-navy/10 shadow-md">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-heading text-navy text-lg font-bold mb-2">You&apos;re Registered!</p>
        <p className="font-body text-navy/60 text-sm leading-relaxed max-w-xs">
          We&apos;ve received your registration. We&apos;ll confirm your spot and send event details to your email.
        </p>
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
        body: JSON.stringify({
          ...data,
          source_page: `events/${eventSlug}`,
          product_interest: `Event Registration: ${eventTitle}`,
          _hp: '',
        }),
      });
      if (res.status === 429) {
        setError('Too many requests — please try again shortly.');
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
    <div className="bg-white rounded-2xl p-6 border border-navy/10 shadow-md h-full flex flex-col">
      <div className="mb-5">
        <span className="inline-block font-body text-xs text-orange uppercase tracking-widest font-semibold mb-2">Register Now</span>
        <p className="font-heading text-navy text-xl font-bold leading-snug">Reserve Your Spot</p>
        <p className="font-body text-navy/50 text-sm mt-1">Seats are limited — secure your place today.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 gap-3">
        <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

        {/* Row 1: Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <input name="name" type="text" required placeholder="Full name *" className={inp} />
          <input name="phone" type="tel" required placeholder="Phone *" className={inp} />
        </div>

        {/* Row 2: Email + Company */}
        <div className="grid grid-cols-2 gap-3">
          <input name="email" type="email" required placeholder="Email *" className={inp} />
          <input name="company" type="text" placeholder="Company" className={inp} />
        </div>

        {/* Row 3: Message */}
        <textarea name="message" rows={3} placeholder="Any questions for us? (optional)" className={`${inp} resize-none flex-1`} />

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-heading font-semibold text-white gradient-sunrise rounded-lg py-3 text-sm shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-200"
        >
          {loading ? 'Registering…' : 'Confirm My Registration'}
        </button>
        <p className="font-body text-navy/40 text-xs text-center">Free to attend &middot; No spam &middot; Confirmation sent by email</p>
      </form>
    </div>
  );
}

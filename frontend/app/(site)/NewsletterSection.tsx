'use client';

import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const res = await fetch(`${apiBase}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
        setName('');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <section className="bg-navy py-16 md:py-20">
      <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Stay Updated</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            Get Industry Updates &amp; Pricing Alerts
          </h2>
          <p className="font-body text-white/60 mb-8">
            Subscribe for steel price trends, new product launches, and exclusive bulk-order deals — straight to your inbox.
          </p>

          {status === 'success' ? (
            <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-xl px-6 py-4">
              <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-body">You&apos;re subscribed! We&apos;ll be in touch soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              {/* Honeypot */}
              <input name="_hp" type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="flex-1 border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-6 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p role="alert" className="font-body text-red-400 text-sm mt-3">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}

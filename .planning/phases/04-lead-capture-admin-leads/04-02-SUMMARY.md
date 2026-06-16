---
plan: "04-02"
status: complete
completed_at: "2026-06-16"
---

# Plan 04-02: Frontend Get Quote Form Wiring

## What Was Built

Wired two Get Quote form entry points on the public site.

## Key Files

### Created
- `frontend/app/(site)/HomeQuoteForm.tsx` — `'use client'` form POSTing to /api/leads with `source_page: 'home'`, honeypot `_hp` field, 429/error handling

### Modified
- `frontend/app/(site)/page.tsx` — Section 7 CTA replaced with `<HomeQuoteForm />` inside a card; page remains a server component
- `frontend/components/ui/GetQuoteCTA.tsx` — converted to `'use client'` expandable inline form; accepts `productName` + `slug` props; posts `source_page: 'product/{slug}'` and `product_interest: productName`
- `frontend/app/(site)/products/[slug]/page.tsx` — passes `product.slug` to `GetQuoteCTA`

## Decisions

- Used plain fetch (matching ContactForm.tsx pattern) instead of react-hook-form/zod since neither is installed in frontend
- Home page form placed in Section 7 CTA area (hero is ScrollHero with no inline form — the glassmorphism carousel was built in a prior style overhaul)
- GetQuoteCTA toggle shows/hides inline form; no modal or page redirect

## Self-Check: PASSED

- `cd frontend && npx tsc --noEmit` → 0 errors
- `HomeQuoteForm.tsx` has `'use client'`, honeypot `_hp` field, `source_page: 'home'`
- `GetQuoteCTA.tsx` has `'use client'`, accepts `slug` prop, sends `source_page: 'product/{slug}'`
- `page.tsx` remains a server component (no `'use client'` directive)

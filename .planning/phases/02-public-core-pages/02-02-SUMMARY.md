---
plan: "02-02"
phase: 2
status: complete
completed_at: "2026-06-14"
commit: 6db3de7
---

# Plan 02-02 Summary: Home Page — 6-Section B2B Conversion Flow

## What Was Built

- **GradientHero**: added optional `bgImage` prop (next/image `fill`), `bg-navy/60` overlay + `opacity-80` gradient when an image is present; unchanged gradient-only mode when `bgImage` is absent
- **next.config.ts**: added `images.remotePatterns` for `images.unsplash.com`
- **frontend/app/(site)/page.tsx**: full Home page with 6 sections:
  1. Hero — Unsplash steel/roofing photo + gradient overlay + glassmorphism Get Quote form (name, phone/email, product dropdown with 10 categories + General Inquiry, semantic `action="#"` form — no JS handler, per Phase 4 deferral)
  2. Stats bar — Founded 2019 / 4.7★ Google Rating / Kanpur-based Manufacturer
  3. Products teaser — 6 product cards + "View All Products" link to `/products`
  4. Why RSG — 4 USP cards (ISI Certified, Fast Delivery, Full Range, Trusted by Leading Brands)
  5. Client/partner logo strip — text chips (Tata Steel, JSW Steel, Jindal Steel, Apollo Pipes, Kamdhenu) with TODO comment for Phase 3 logo images
  6. Testimonials — `TESTIMONIALS` const array (3 real Google/IndiaMART reviews) + `RATINGS` const array, navy background, GlassCard layout

## Key Files

- `frontend/app/(site)/page.tsx`
- `frontend/components/ui/GradientHero.tsx`
- `frontend/next.config.ts`

## Deviations

- Home page component (`Home`) is not declared `async` — plan suggested `async function Home()` but the page performs no data fetching, so an async signature would be unnecessary. Functionally equivalent as a server component (no "use client").
- Hero `minHeight` set to `min-h-screen` (not GradientHero's default `min-h-[480px]`) to give the glass form panel a full-viewport hero per D-02 visual direction.

## Self-Check: PASSED

- `cd frontend && npx tsc --noEmit` → 0
- Hero renders `next/image` with Unsplash URL + `priority`
- Testimonials section contains "Satisfactory service and behaviour." attributed to "Shivkant Dixit"
- Product dropdown includes "General Inquiry" + 10 categories
- GradientHero gradient overlay still applied on top of bgImage (bg-navy/60 + opacity-80 gradient-premium)

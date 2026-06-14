---
plan: "02-01"
phase: 2
status: complete
completed_at: "2026-06-14"
commit: cc23e7d
---

# Plan 02-01 Summary: Site Layout Foundation

## What Was Built

All public pages now inherit a shared shell via `frontend/app/(site)/layout.tsx`:
- **SiteHeader**: fixed navy header with logo, desktop nav (Home/About/Products/Contact), "Get Quote" CTA, and CSS-only mobile hamburger menu
- **SiteFooter**: two-row navy footer with brand info, quick links, social icons (Instagram/LinkedIn/Facebook), copyright, and do-follow Buildera credit link
- **WhatsAppFloat**: fixed green button linking to `wa.me/<number>`; hidden when number is empty string
- **frontend/lib/api.ts**: `getSettings()` helper with ISR revalidation (3600s)
- **backend/src/db/seed.ts**: extended with `business_address`, `business_hours`, `business_phone` keys

## Key Files

- `frontend/app/(site)/layout.tsx` — async server layout wrapping all public pages
- `frontend/components/layout/SiteHeader.tsx`
- `frontend/components/layout/SiteFooter.tsx`
- `frontend/components/layout/WhatsAppFloat.tsx`
- `frontend/lib/api.ts`
- `backend/src/db/seed.ts`

## Deviations

- Added `pt-16` to the `<main>` in layout to offset the fixed header height — not in plan but required for content to not hide behind fixed nav.
- Deleted stale `.next/types` cache which held a reference to the removed `app/page.tsx`; tsc passes cleanly after cache clear.

## Self-Check: PASSED

- `cd backend && npx tsc --noEmit` → 0
- `cd frontend && npx tsc --noEmit` → 0
- Buildera link uses `rel="noopener"` only (no nofollow/sponsored)
- WhatsAppFloat returns null when number is empty string
- Settings fetch wrapped in try/catch in layout

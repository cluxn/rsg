---
plan: "03-02"
status: complete
completed: 2026-06-15
commit: be6358c
---

# Summary: Frontend Product Pages (SSG + ISR)

## What was built

- `frontend/lib/api.ts` — added `ProductMedia`, `ProductSpec`, `ProductSummary`, `Product` types and `getProducts()` / `getProduct(slug)` helpers, following the existing `getSettings()` convention (`NEXT_PUBLIC_API_URL`-based `API_BASE`, `next.revalidate`/`next.tags` for ISR) rather than introducing a separate `BACKEND_URL`.
- `frontend/components/ui/ProductHero.tsx` — full-width hero, `next/image` with `fill`/`priority`/`object-cover`, `gradient-premium` overlay, product name as `h1`.
- `frontend/components/ui/SpecsTable.tsx` — returns `null` when `specs` is empty/null (D-05), alternating-row two-column table, `text-[15px]` minimum.
- `frontend/components/ui/GetQuoteCTA.tsx` — `id="get-quote-section"` band with orange `CTAButton` stub (Phase 4 wires submission).
- `frontend/app/(site)/products/[slug]/page.tsx` — `revalidate = 3600`, `generateStaticParams()` from `getProducts()` (dynamic — covers all products in the `products` table, not hardcoded to 10), `generateMetadata`, two-column layout (primary image constrained to `max-w-[500px]`, sticky content column with key-spec highlights + Get Quote CTA), `SpecsTable`, `GetQuoteCTA`.
- `frontend/app/(site)/products/[slug]/not-found.tsx` — "Product Not Found" page with link back to products.

## Verification

- `cd frontend && npx tsc --noEmit` — 0 errors
- `next build` generates static pages for all product slugs returned by `getProducts()`
- Fixed a backend bug where the `products.specs` JSON column was returned as a serialized string by `mysql2` in some paths, causing `product.specs.slice` to fail on the frontend — backend now parses/returns `specs` as a proper JSON array (see commit `be6358c`, "fix specs JSON parsing").

## Deviations

- `params` typed as `Promise<{ slug: string }>` (this Next.js version's async params convention — see `frontend/AGENTS.md`), not the plain `{ slug: string }` object shown in the plan's code sample.
- Hero image map / stock photo sourcing (Task 2) used whatever assets were already available under `frontend/public/products/`; no new stock photo downloads were performed as part of this plan.

## Follow-ups / Blockers

- None — Phase 3 (03-01..03-04) fully implemented. The catalog was later expanded from 10 to 19 products (`004_catalog_expansion.sql`); since `generateStaticParams`/`Catalog.tsx` are both dynamic (`getProducts()` / `GET /api/products`), the 9 new products are served by this same template with no additional page-building work.

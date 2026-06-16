---
plan: "06-03"
title: "Dynamic Sitemap"
status: complete
phase: 6
completed: "2026-06-16"
---

## What Was Built

Created `frontend/app/sitemap.ts` using Next.js App Router's built-in sitemap convention. Auto-served at `/sitemap.xml` without additional configuration.

**Files created:**
- `frontend/app/sitemap.ts` — dynamic sitemap fetching product and blog slugs at request time

## Key Details

**Static routes (6):** `/`, `/about`, `/contact`, `/products`, `/blog`, `/events` with appropriate priority and changeFrequency values.

**Dynamic routes:** Fetches all product slugs via `getProducts()` and all published blog slugs via `getBlogPosts()` using `Promise.allSettled` so backend failure returns only static routes.

**Resilience:** When backend is unreachable, sitemap returns 200 with the 6 static routes. Individual API failures don't affect the other dynamic routes.

**BASE_URL:** Reads from `NEXT_PUBLIC_SITE_URL` with fallback to `https://rsgprofilesheets.com`.

**Excluded:** Events detail routes (`/events/[slug]`) not included per D-12 scope — events page has no individual detail route.

## Acceptance Criteria Met

- [x] `frontend/app/sitemap.ts` exists and exports default async function
- [x] 6 static routes included with correct priorities
- [x] Product and blog dynamic routes included
- [x] Promise.allSettled ensures graceful degradation on backend failure
- [x] BASE_URL reads from env var with fallback
- [x] `cd frontend && npx tsc --noEmit` exits 0

## Self-Check: PASSED

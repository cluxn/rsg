---
plan: "06-02"
title: "Frontend — Script Injection & Per-Page Meta"
status: complete
phase: 6
completed: "2026-06-16"
---

## What Was Built

Wired admin SEO settings into the public Next.js frontend: script injection in root layout and per-page meta via async generateMetadata on all 6 static pages.

**Files modified:**
- `frontend/app/layout.tsx` — made async, fetches seo_head_scripts, injects via dangerouslySetInnerHTML; replaced static metadata export with async generateMetadata
- `frontend/app/(site)/page.tsx` — added async generateMetadata reading meta_title_/ and meta_desc_/
- `frontend/app/(site)/about/page.tsx` — replaced static metadata with async generateMetadata
- `frontend/app/(site)/contact/page.tsx` — replaced static metadata with async generateMetadata
- `frontend/app/(site)/blog/page.tsx` — replaced static metadata with async generateMetadata
- `frontend/app/(site)/events/page.tsx` — replaced static metadata with async generateMetadata
- `frontend/app/(site)/products/page.tsx` — replaced static metadata with async generateMetadata

## Key Details

**Script injection:** Root layout fetches `seo_head_scripts` with try/catch fallback to empty string. When non-empty, strips outer `<script>` wrapper tags and injects content via `dangerouslySetInnerHTML` with intentional-use comment. No script tag added when empty.

**Per-page meta:** All 6 pages read their respective settings keys with fallback to previously hardcoded defaults. All `getSettings()` calls wrapped in try/catch — backend failure falls back gracefully, no 500 errors.

**contact/page.tsx:** Already imported `getSettings` for runtime contact data; the additional `generateMetadata` call is a separate fetch that Next.js deduplicates.

## Acceptance Criteria Met

- [x] layout.tsx default export is async
- [x] getSettings() called with try/catch fallback
- [x] dangerouslySetInnerHTML comment present
- [x] All 6 pages have async generateMetadata (no export const metadata)
- [x] Each reads correct settings key pair for its path
- [x] Fallback strings match previously hardcoded values exactly
- [x] `cd frontend && npx tsc --noEmit` exits 0

## Self-Check: PASSED

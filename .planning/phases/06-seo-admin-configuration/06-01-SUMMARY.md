---
plan: "06-01"
title: "Admin SEO Page"
status: complete
phase: 6
completed: "2026-06-16"
---

## What Was Built

Created the admin `/seo` page following the exact Settings.tsx pattern (useQuery + useMutation + local state + single Save button).

**Files created/modified:**
- `admin/src/pages/Seo.tsx` — new SEO page component with two sections
- `admin/src/App.tsx` — added /seo route wrapped in ProtectedRoute
- `admin/src/components/layout/Sidebar.tsx` — added SEO nav entry with Search icon

## Key Details

**Section 1 — Head Scripts:** Textarea bound to `seo_head_scripts` settings key, monospace font, 6 rows, full width. Ships empty by default.

**Section 2 — Page Meta:** One row per page for all 6 static routes (`/`, `/about`, `/contact`, `/blog`, `/events`, `/products`). Each row has Meta Title and Meta Description inputs bound to `meta_title_{path}` and `meta_desc_{path}` keys.

**State/mutation pattern:** Identical to Settings.tsx — useQuery reads all 13 keys on mount, single Save button calls `PUT /settings` with all values, invalidates ['settings'] cache on success, shows "Settings saved." for 3 seconds.

## Acceptance Criteria Met

- [x] `admin/src/pages/Seo.tsx` exists and exports `SeoPage`
- [x] Two sections: Head Scripts textarea + Page Meta table with 6 rows
- [x] All 13 settings keys read from and written to settings API
- [x] Save button calls `PUT /settings`
- [x] `cd admin && npx tsc --noEmit` exits 0

## Self-Check: PASSED

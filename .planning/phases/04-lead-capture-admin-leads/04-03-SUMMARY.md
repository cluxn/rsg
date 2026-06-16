---
plan: "04-03"
status: complete
completed_at: "2026-06-16"
---

# Plan 04-03: Admin Leads List + CSV Export/Import UI

## What Was Built

Admin Leads page with full CRUD-less lead management UI.

## Key Files

### Created
- `admin/src/pages/Leads.tsx` — `LeadsPage` with TanStack Query pagination, table (6 columns), CSV export button, CSV import (hidden file input + multipart POST), result message

### Modified
- `admin/src/App.tsx` — added `/leads` route behind `ProtectedRoute`
- `admin/src/pages/Dashboard.tsx` — Leads stat card now fetches live count from `GET /api/leads?page=1&limit=1`

## Decisions

- Export uses `window.open('/api/leads/export', '_blank')` — session cookie sent automatically, no axios blob workaround needed
- Import result shown inline as `<p>` text, no toast library
- Dashboard count reuses the existing leads endpoint (total field from paginated response)

## Self-Check: PASSED

- `cd admin && npx tsc --noEmit` → 0 errors
- `LeadsPage` is a named export wrapped in `AdminLayout`
- Table columns: Name, Phone, Email, Product Interest, Source, Date
- `/leads` route registered in App.tsx behind ProtectedRoute

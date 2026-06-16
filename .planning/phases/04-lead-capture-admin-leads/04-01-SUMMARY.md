---
plan: "04-01"
status: complete
completed_at: "2026-06-16"
---

# Plan 04-01: Backend Admin Leads API + Spam Protection

## What Was Built

Extended the existing leads backend with admin read endpoints, spam protection, and rate limiting.

## Key Files

### Modified
- `backend/src/services/leads.service.ts` — added `getLeads`, `exportLeadsToCSV`, `importLeadsFromCSV`
- `backend/src/controllers/leads.controller.ts` — added honeypot check in `submitLead`, new `listLeads`, `exportLeads`, `importLeads` handlers
- `backend/src/routes/leads.ts` — wired 4 routes: POST /, GET /, GET /export, POST /import
- `backend/src/index.ts` — added `express-rate-limit` (10 req/15min/IP) before leadsRouter mount
- `backend/package.json` — added `express-rate-limit@^7`

## Decisions

- Used inline `multer` with memoryStorage (5MB limit) on `/import` route, separate from the media upload middleware (different limits/filters)
- CSV stringify uses named column headers matching the DB schema
- Import is row-by-row (no transaction) — skips empty-name rows, logs errors, continues

## Self-Check: PASSED

- `cd backend && npx tsc --noEmit` → 0 errors
- All 4 routes wired: POST / (public), GET / (admin), GET /export (admin), POST /import (admin)
- Honeypot check in `submitLead` before zod validation
- Rate limiter applied to all `/api/leads` methods

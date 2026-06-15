---
plan: "02-04"
phase: 2
status: complete
completed_at: "2026-06-15"
commit: 802a229
---

# Plan 02-04 Summary: Contact Page + Leads API Endpoint

## What Was Built

- **`backend/src/services/leads.service.ts`**: `createLead()` — parameterized INSERT into `leads` table, then fire-and-forget POST to `LEAD_WEBHOOK_URL` (5s timeout, failures swallowed per D-07), sets `webhook_sent = TRUE` on success.
- **`backend/src/controllers/leads.controller.ts`**: `submitLead()` — zod schema requires `name` plus (`phone` OR `email`); returns 400 with `{ error: 'Validation failed' }` on invalid input, 201 with `{ success, leadId }` on success.
- **`backend/src/routes/leads.ts`**: `POST /` mounted at `/api/leads` in `backend/src/index.ts` — public, no `requireAuth`.
- **`frontend/app/(site)/contact/page.tsx`**: server component — fetches `getSettings()` for address/hours/phone/email (no hardcoded fallbacks), hero, two-column layout (contact details + Google Maps iframe on the left, form on the right), footer credit.
- **`frontend/app/(site)/contact/ContactForm.tsx`**: `'use client'` component — Full Name/Phone/Email/Product Interest (dropdown of 10 categories + "General Inquiry")/Message fields, posts to `${NEXT_PUBLIC_API_URL}/api/leads` with `source_page: 'contact'`, shows inline "Thank you!" success state on 201 (no redirect), inline error message on failure.

## Key Files

- `backend/src/services/leads.service.ts`
- `backend/src/controllers/leads.controller.ts`
- `backend/src/routes/leads.ts`
- `frontend/app/(site)/contact/page.tsx`
- `frontend/app/(site)/contact/ContactForm.tsx`

## Deviations

- None significant — implementation follows the plan's code samples directly.

## Self-Check: PASSED

- `cd backend && npx tsc --noEmit` → 0
- `cd frontend && npx tsc --noEmit` → 0
- `POST /api/leads` with valid `{name, phone, product_interest, source_page}` → 201 `{success:true, leadId}`
- `POST /api/leads` with `{}` → 400 `{error: 'Validation failed'}`
- `/contact` renders address/hours/phone/email from settings API, Google Maps iframe, "Send an Enquiry" form with product dropdown

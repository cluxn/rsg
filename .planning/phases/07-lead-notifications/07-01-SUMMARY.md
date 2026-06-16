---
plan: "07-01"
status: complete
completed_at: "2026-06-16"
---

# Plan 07-01: Schema Migration + Notification Service

## What Was Built

- `backend/src/db/migrations/007_lead_email_sent.sql` — ALTER TABLE statement adding `email_sent BOOLEAN NOT NULL DEFAULT FALSE` to the leads table, mirroring the existing `webhook_sent` column.
- `backend/src/services/notification.service.ts` — exports `sendLeadNotificationEmail` which reads `notification_email` from settings and SMTP config from env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Returns `true` on confirmed delivery, `false` otherwise (all errors swallowed silently).

## Deviations

None.

## Self-Check: PASSED

- Migration file exists with exact ALTER TABLE statement
- `sendLeadNotificationEmail` returns `false` when `notification_email` is missing/empty
- `sendLeadNotificationEmail` returns `false` when any SMTP env var is missing
- Plain-text email body includes all required fields
- Subject format: `New lead from ${name} — ${product_interest ?? 'General enquiry'}`
- `cd backend && npx tsc --noEmit` exits 0

## Key Files Created

- `backend/src/db/migrations/007_lead_email_sent.sql`
- `backend/src/services/notification.service.ts`

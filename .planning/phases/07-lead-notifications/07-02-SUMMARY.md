---
plan: "07-02"
status: complete
completed_at: "2026-06-16"
---

# Plan 07-02: Wire Notification + Admin Settings Field

## What Was Built

- `backend/src/services/leads.service.ts` updated:
  - Imports `sendLeadNotificationEmail` from `./notification.service`
  - Calls `sendLeadNotificationEmail` after the n8n webhook block in `createLead`, with same fire-and-forget try/catch; updates `email_sent = TRUE` on confirmed delivery
  - `LeadRow` interface now includes `email_sent: boolean`
  - `getLeads` SELECT includes `email_sent` column
  - `exportLeadsToCSV` SELECT and stringify columns include `email_sent` / `'Email Sent'`
- `admin/src/pages/Settings.tsx` updated:
  - Added `{ key: 'notification_email', label: 'Notification Email', hint: '...', type: 'email' }` to `GENERAL_FIELDS`

## Deviations

None.

## Self-Check: PASSED

- `leads.service.ts` imports `sendLeadNotificationEmail` from `./notification.service`
- `createLead` calls it after n8n block; `email_sent = TRUE` set on `true` return
- Error catch swallows silently
- `LeadRow`, `getLeads`, `exportLeadsToCSV` all include `email_sent`
- `notification_email` field added to `GENERAL_FIELDS` with `type: 'email'`
- `cd backend && npx tsc --noEmit` exits 0
- `cd admin && npx tsc --noEmit` exits 0

## Key Files Modified

- `backend/src/services/leads.service.ts`
- `admin/src/pages/Settings.tsx`

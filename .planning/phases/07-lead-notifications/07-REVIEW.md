---
phase: 7
plan: "07"
status: warning
depth: standard
reviewed_at: "2026-06-16"
---

# Code Review — Phase 7: Lead Notifications

## Scope

Files reviewed:
- `backend/src/db/migrations/007_lead_email_sent.sql`
- `backend/src/services/notification.service.ts`
- `backend/src/services/leads.service.ts`
- `admin/src/pages/Settings.tsx`

## Findings

### Warning

**W-01 — Bulk import triggers email per row**
- File: `backend/src/services/leads.service.ts` → `importLeadsFromCSV`
- `importLeadsFromCSV` calls `createLead` for each row, which now fires `sendLeadNotificationEmail` on every call. Importing 50 leads would send 50 emails.
- Fix: Add an `skipNotification?: boolean` param to `CreateLeadInput` and `createLead`, defaulting to `false`. Set it to `true` inside `importLeadsFromCSV`.

### Info

**I-01 — Non-numeric SMTP_PORT silently becomes NaN**
- File: `backend/src/services/notification.service.ts` line 22
- `Number(SMTP_PORT)` returns `NaN` if the env var is set to a non-numeric string (e.g., `"smtp"` passes the `!SMTP_PORT` guard but produces `NaN`). Nodemailer will fail at connect time, which is caught and swallowed silently.
- Not a bug in practice — just note it in .env documentation.

**I-02 — No `secure` option on transporter**
- File: `backend/src/services/notification.service.ts` line 21–25
- Nodemailer defaults `secure: false`. For port 465 (SSL), `secure: true` is required. For port 587 (STARTTLS), `false` is correct. If the project uses port 465, emails will fail silently.
- Recommend noting in .env docs: `SMTP_PORT=587` with TLS, or add `SMTP_SECURE=true` env var support.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| Warning | 1 |
| Info | 2 |

W-01 (bulk import emails) is the only actionable finding — consider addressing before client handover if CSV import is used.

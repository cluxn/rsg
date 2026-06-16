# Phase 7: Lead Notifications - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 7-lead-notifications
**Areas discussed:** SMTP & recipient config, Email content, Failure tracking

---

## SMTP & Recipient Config

| Option | Description | Selected |
|--------|-------------|----------|
| Env vars only | SMTP credentials in `.env`, no admin UI | ✓ |
| Admin-configurable SMTP | Credentials stored in settings table, editable via admin | |
| Mix: credentials in env, recipient in admin | Secrets stay in env, just the recipient email is admin-configurable | (adopted — see Notes) |

**User's choice:** "do as senior"
**Notes:** Senior decision — SMTP credentials in `.env` (secrets, never in DB). Recipient email (`notification_email`) in admin Settings page via `settings` table (client needs to change this without server access). One new field on the existing Settings form — no new page.

---

## Email Content

| Option | Description | Selected |
|--------|-------------|----------|
| Plain text, full details | Name, phone, email, product interest, message, source page | ✓ |
| HTML email | Formatted email with RSG branding | |
| Minimal text | Just "New lead submitted — check admin panel" | |

**User's choice:** "do as senior"
**Notes:** Plain text chosen — more reliable delivery, simpler to maintain, avoids spam filter issues from HTML. Full lead details in body so admin doesn't need to open the panel for basic triage.

---

## Failure Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| `email_sent` flag on lead row | Boolean column matching existing `webhook_sent` | ✓ |
| Log only | Console/file log, no DB tracking | |
| No tracking | Silent fire-and-forget, no visibility | |

**User's choice:** "do as senior"
**Notes:** `email_sent BOOLEAN DEFAULT FALSE` added to leads table — mirrors `webhook_sent` exactly. Consistent pattern, gives admin visibility into notification status, trivial migration cost.

---

## Claude's Discretion

All three areas were delegated to Claude ("do as senior"). Decisions made:
- SMTP credentials in env, recipient email in admin settings
- Plain text email with all lead fields, subject `New lead from [name] — [product interest]`
- `email_sent` column on leads table, fire-and-forget with 5s timeout, silent failure

## Deferred Ideas

- HTML email template with RSG branding
- Multiple notification recipients
- Retry queue for failed notifications

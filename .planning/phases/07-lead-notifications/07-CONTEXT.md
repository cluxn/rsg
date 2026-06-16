# Phase 7: Lead Notifications - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

When a new "Get Quote" lead is saved to the database, fire an SMTP email notification to an admin-configured recipient address. This is a pure backend addition — no new public pages, no new admin CMS pages beyond one new field on the existing Settings page. The n8n webhook integration (Phase 4) is a separate, already-live mechanism; this phase adds SMTP email alongside it.

Not in scope: email templates via admin, notification for other events (blog publish, etc.), multi-recipient CC/BCC management, retry queue, read-receipts.

</domain>

<decisions>
## Implementation Decisions

### SMTP Configuration
- **D-01:** SMTP credentials (host, port, user, password, from-address) stored in `.env` only — never in the database. They are secrets and must not be exposed via admin UI or the settings API.
- **D-02:** Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. If any are missing, the notification service skips sending silently (same pattern as `LEAD_WEBHOOK_URL`).
- **D-03:** Library: `nodemailer` (Node.js standard for SMTP, no external service dependency).

### Recipient Configuration
- **D-04:** Recipient email is admin-configurable — stored in the `settings` table under key `notification_email`. Admin sets it on the existing Settings page (one new field added to the General Settings form in `admin/src/pages/Settings.tsx`).
- **D-05:** If `notification_email` is empty or unset, skip sending — no crash, no error. Client will configure it after handover.
- **D-06:** Single recipient only. Multiple addresses are out of scope.

### Email Content
- **D-07:** Plain text email (not HTML). Plain text is more reliably delivered, avoids spam filter issues from HTML/CSS formatting, and is simpler to maintain.
- **D-08:** Email body includes: lead name, phone, email, product interest, message, source page, and submission timestamp. Subject line: `New lead from [name] — [product interest]`.
- **D-09:** No link to admin panel in the email body (admin URL is not known at build time and would require another env var — not worth the complexity for this phase).

### Failure Handling & Tracking
- **D-10:** Notification failure must not block the lead save — same pattern as the existing n8n webhook. The lead is already in the DB when the email fires.
- **D-11:** Add `email_sent BOOLEAN NOT NULL DEFAULT FALSE` column to the `leads` table. Set to `TRUE` only after `nodemailer` confirms delivery. Mirrors the existing `webhook_sent` column exactly.
- **D-12:** Notification is sent in `createLead` immediately after the n8n webhook block, in a `try/catch` that swallows errors. No async queue, no retry — fire-and-forget with a 5-second timeout (same as webhook).

### Implementation Shape
- **D-13:** New file `backend/src/services/notification.service.ts` exports `sendLeadNotificationEmail(lead)`. Keeps email logic out of `leads.service.ts`.
- **D-14:** `createLead` calls `sendLeadNotificationEmail` and, on success, runs `UPDATE leads SET email_sent = TRUE WHERE id = ?`. Failure is swallowed.
- **D-15:** Schema migration: `ALTER TABLE leads ADD COLUMN email_sent BOOLEAN NOT NULL DEFAULT FALSE` — one-liner migration script, same pattern as prior phases.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/ROADMAP.md` §Phase 7 — Goal and success criteria (2 items), requirement NOTIF-01
- `.planning/REQUIREMENTS.md` §Lead Notifications (NOTIF) — NOTIF-01 definition; also LEAD-01 for context on what `createLead` is expected to do

### Existing Code to Read Before Planning
- `backend/src/services/leads.service.ts` — `createLead` function is where email notification hooks in; study the n8n webhook block (lines 22-38) — the email block follows the same try/catch/silent-failure pattern
- `backend/src/services/settings.service.ts` — `getAllSettings` is how the service reads `notification_email` at send time
- `admin/src/pages/Settings.tsx` — add one new `notification_email` input field here; follow the existing form/mutation pattern exactly
- `backend/src/routes/settings.ts` and `backend/src/controllers/settings.controller.ts` — no changes needed; `PUT /settings` already accepts arbitrary key-value pairs

### Design System & Scope
- `.planning/SCOPE-DECISIONS.md` — authoritative scope record; SMTP/n8n distinction is documented here

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/services/leads.service.ts` `createLead`: the n8n webhook block (try/catch, AbortSignal.timeout(5000), silent swallow, then UPDATE flag) is the exact pattern to replicate for email
- `backend/src/services/settings.service.ts` `getAllSettings`: call this inside `sendLeadNotificationEmail` to read `notification_email` — no new DB abstraction needed
- `admin/src/pages/Settings.tsx` `GeneralSettingsForm`: add `notification_email` input here; the useQuery + useMutation + local state + save button pattern is already established

### Established Patterns
- Silent failure: failures in async side-effects (webhook, now email) are swallowed in try/catch — lead stays saved regardless
- Boolean tracking columns: `webhook_sent` on the leads table is the model for `email_sent`
- Settings as flat key-value: `notification_email` follows the same convention as all other settings keys

### Integration Points
- `backend/src/services/leads.service.ts` `createLead` → call `sendLeadNotificationEmail` after n8n webhook block
- `backend/src/services/notification.service.ts` → new file; reads `notification_email` from settings, reads SMTP config from `process.env`, sends via nodemailer
- `admin/src/pages/Settings.tsx` → add `notification_email` field to the existing General Settings form
- MySQL `leads` table → add `email_sent` column via migration script

</code_context>

<specifics>
## Specific Ideas

- Subject line format: `New lead from [name] — [product interest]` (concise, scannable in email inbox)
- Env var names: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — standard nodemailer config keys
- Settings key: `notification_email` — consistent with existing key naming convention (snake_case, descriptive)
- The `email_sent` column should appear in the leads export CSV alongside `webhook_sent` — no separate change needed if `exportLeadsToCSV` selects all columns

</specifics>

<deferred>
## Deferred Ideas

- HTML email template with RSG branding — plain text is sufficient for launch
- Multiple notification recipients (CC/BCC list)
- Retry queue for failed notifications
- Notification on other events (e.g., new blog comment, if added in future)

None came from discussion scope creep.

</deferred>

---

*Phase: 7-Lead Notifications*
*Context gathered: 2026-06-16*

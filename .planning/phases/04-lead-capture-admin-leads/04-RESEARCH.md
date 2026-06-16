# Phase 4: Lead Capture & Admin Leads — Research

**Phase:** 4 — Lead Capture & Admin Leads
**Date:** 2026-06-16
**Requirements:** LEAD-01, LEAD-02, LEAD-03, LEAD-04

---

## What Already Exists (Do Not Rebuild)

### Backend (from Phase 2, Plan 02-04)
- `backend/src/services/leads.service.ts` — `createLead()` inserts into `leads` table, then fire-and-forget POST to `LEAD_WEBHOOK_URL` (5s timeout, failure swallowed).
- `backend/src/controllers/leads.controller.ts` — `submitLead()` with zod schema: name (required) + phone OR email (at least one). Returns 400 on failure, 201 `{ success, leadId }` on success.
- `backend/src/routes/leads.ts` — `POST /` mounted at `POST /api/leads` in `index.ts`. Public, no auth.

### Database
`leads` table columns: `id`, `name`, `phone`, `email`, `product_interest`, `message`, `source_page`, `webhook_sent`, `created_at`. Already covers LEAD-02 (source tracking via `source_page`).

### Admin Sidebar
`Sidebar.tsx` already has a `Leads` nav item pointing to `/leads`. No page exists yet — needs `Leads.tsx` + route registration.

### Frontend stubs (need wiring)
- `frontend/app/(site)/page.tsx` — Home page: Get Quote form is `action="#"` with no JS handler. Fields exist: name, phone/email, product dropdown. Must extract a `'use client'` component.
- `frontend/components/ui/GetQuoteCTA.tsx` — product page CTA: renders an orange button stub with `id="get-quote-section"`. Phase 3 CONTEXT.md explicitly deferred form submission to Phase 4.

---

## What Phase 4 Must Build

### 1. Backend: Admin Leads API + Spam Protection

**New routes on `/api/leads`:**
- `GET /api/leads` — auth protected (`requireAuth`). Query params: `page` (default 1), `limit` (default 25). Returns `{ leads: LeadRow[], total, page, limit }`. Orders by `created_at DESC`.
- `GET /api/leads/export` — auth protected. Streams a CSV file. Response headers: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="rsg-leads-{DATE}.csv"`. Uses `csv-stringify` (already installed).
- `POST /api/leads/import` — auth protected. Accepts a multipart CSV upload (multer single file). Parses with `csv-parse` (already installed). Inserts valid rows, skips blanks. Returns `{ imported, skipped, errors }`.

**Spam protection on `POST /api/leads`:**
- **Honeypot field**: `submitLead()` checks `req.body._hp` — if truthy, returns `res.status(200).json({ success: true })` silently (bots see success, lead is NOT saved).
- **Rate limiting**: install `express-rate-limit@^7`, apply to `leadsRouter` in `index.ts`: 10 requests per 15 minutes per IP (`windowMs: 15*60*1000, max: 10`). Returns 429 on breach — frontend can show "Too many requests, please try later."

**New service methods in `leads.service.ts`:**
```ts
getLeads(page: number, limit: number): Promise<{ leads: Lead[], total: number }>
exportLeads(): Promise<string>   // returns CSV string via csv-stringify
importLeads(csvBuffer: Buffer): Promise<{ imported: number, skipped: number, errors: string[] }>
```

**New controller handlers in `leads.controller.ts`:**
```ts
listLeads(req, res)   // GET /api/leads?page&limit
exportLeads(req, res) // GET /api/leads/export
importLeads(req, res) // POST /api/leads/import
```

### 2. Frontend: Wire Get Quote Forms

**Home page (`frontend/app/(site)/page.tsx`):**
- Extract the glassmorphism form into `frontend/app/(site)/HomeQuoteForm.tsx` (`'use client'`).
- Uses `react-hook-form` + zod schema matching backend: name required, phone OR email required, product_interest, message.
- On submit: `POST ${process.env.NEXT_PUBLIC_API_URL}/api/leads` with `source_page: 'home'`. Honeypot field `_hp` hidden, always empty.
- On 201: show inline "Thank you! We'll be in touch within 24 hours." (replaces form, same pattern as `ContactForm.tsx`).
- On 429: show "Too many requests — please try again in a few minutes."
- On other error: show "Failed to send. Please try WhatsApp or call us directly."
- The visual form wrapper (glassmorphism card) stays in the server component `page.tsx`; only the form logic moves to the client component.

**Product page (`frontend/components/ui/GetQuoteCTA.tsx`):**
- Convert to `'use client'`.
- Clicking the orange "Get Quote" button toggles an inline expanded form below the button (no modal — product pages are already two-column with the CTA in the sticky right column).
- Form fields: name (required), phone OR email (required), message (optional). Product interest auto-filled from `props.productName`.
- On submit: `POST ${process.env.NEXT_PUBLIC_API_URL}/api/leads` with `source_page: product/{slug}` (requires `slug` prop).
- On 201: collapse form, show "Thank you! We'll contact you about this product."
- On 429/error: inline error message.
- Honeypot `_hp` hidden field included.

### 3. Admin: Leads Page + CSV Export/Import

**`admin/src/pages/Leads.tsx`:**
- Named export `LeadsPage`, wrapped in `<AdminLayout>`.
- TanStack Query: `useQuery(['leads', page], () => api.get('/leads', { params: { page, limit: 25 } }))`.
- shadcn `Table` (same pattern as MediaLibrary): columns — Name, Phone, Email, Product Interest, Source, Date (formatted).
- Pagination: prev/next buttons, "Page N of M" display.
- **Export CSV button**: `<a href="/api/leads/export">` download link using the authenticated session cookie (since `withCredentials: true` on the axios instance, a plain anchor will also send the cookie). Or use `api.get('/leads/export', { responseType: 'blob' })` + `URL.createObjectURL` for a programmatic download that handles auth.
- **Import CSV button**: file input (accept=".csv"), on change POST to `/leads/import` via `FormData`, show result toast.
- Register `/leads` route in `admin/src/App.tsx` with `ProtectedRoute`.

---

## Patterns to Follow

- Admin page structure: named export `XxxPage`, `<AdminLayout>` wrapper, `p-8` content padding — matches `CatalogPage`, `MediaLibraryPage`, `SettingsPage`.
- TanStack Query key pattern: `['leads', page]` — matches `['products']`, `['media']`.
- API calls: via `api` from `@/lib/api` (axios with `/api` baseURL + credentials).
- Controller pattern: `listLeads`, `exportLeads`, `importLeads` in `leads.controller.ts` — single file, same as `settings.controller.ts`.
- Route registration: add handlers to `leads.ts` router, auth middleware inline.

---

## Dependencies

| Package | Status | Used for |
|---------|--------|---------|
| csv-stringify | Already installed (backend) | CSV export |
| csv-parse | Already installed (backend) | CSV import |
| express-rate-limit | **Must install** | Rate limit POST /api/leads |
| multer | Already installed (backend) | CSV import file upload |
| react-hook-form | Already installed (frontend) | Home form wiring |
| zod | Already installed (frontend) | Home form schema |

---

## Plan Structure

3 plans across 2 waves:

| Plan | Wave | Depends On | What it builds |
|------|------|-----------|----------------|
| 04-01 | 1 | — | Backend admin leads API + spam protection |
| 04-02 | 1 | — | Frontend Get Quote form wiring (home + product pages) |
| 04-03 | 2 | 04-01 | Admin Leads list + CSV export/import UI |

Wave 1 plans are independent (backend vs. frontend touches different files). Wave 2 admin UI depends on the backend admin routes from 04-01.

---

## Validation Architecture

**Verification checks (after all 3 plans):**
1. `POST /api/leads` with valid body → 201 (existing — already passes)
2. `POST /api/leads` with `_hp: "bot"` → 200 but no new row in DB (honeypot test)
3. `POST /api/leads` 11 times in a minute → 429 on 11th (rate limit test)
4. `GET /api/leads` without cookie → 401
5. `GET /api/leads` with admin cookie → 200 `{ leads, total, page, limit }`
6. `GET /api/leads/export` with admin cookie → 200 text/csv with correct headers
7. `POST /api/leads/import` with admin cookie + valid CSV → `{ imported: N }`
8. Home page: submit form → 201, form replaced with success message
9. Product page: click "Get Quote" → form expands → submit → success message shown
10. Admin Leads page (`/leads`): table shows leads, export button triggers download, import button accepts CSV

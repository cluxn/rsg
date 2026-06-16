# Phase 6: SEO & Admin Configuration - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Give admin users full control over SEO without developer involvement: inject arbitrary tracking scripts into `<head>`, set meta title/description per static page, and serve a dynamic sitemap.xml. This completes launch-readiness.

Not in scope: per-post or per-product SEO overrides (blog/[slug] and products/[slug] pages derive meta from their own content), robots.txt management, Open Graph image configuration.

</domain>

<decisions>
## Implementation Decisions

### Script Injection (SEO-01)
- **D-01:** Admin pastes full `<script>…</script>` tag(s) — same as copying from GA/GTM/FB Pixel provider docs. No stripping required.
- **D-02:** Single textarea, `<head>` only. No body-end slot.
- **D-03:** Stored in the `settings` table under key `seo_head_scripts`. Injected via `dangerouslySetInnerHTML` in `frontend/app/layout.tsx` root layout (acceptable — only auth-gated admin can write this value).
- **D-04:** Ships with empty string (no scripts) by default — satisfies success criteria 2.

### Admin SEO UI (placement + structure)
- **D-05:** New "SEO" entry in the admin sidebar — separate from the existing Settings page. Settings = operational config (contact info, WhatsApp); SEO = search indexing config.
- **D-06:** Single `/seo` admin page with two sections: (1) "Head Scripts" textarea at top, (2) per-page meta table below. No sub-routing.

### Per-Page Meta (SEO-02)
- **D-07:** Stored in the existing `settings` table using prefixed keys: `meta_title_/`, `meta_desc_/`, `meta_title_/about`, `meta_desc_/about`, etc. No new table or migration required.
- **D-08:** Editable pages (fixed list of 6): Home (`/`), About (`/about`), Contact (`/contact`), Blog (`/blog`), Events (`/events`), Products (`/products`). Dynamic routes (products/[slug], blog/[slug]) already generate meta from their content.
- **D-09:** Frontend reads these keys via the existing `GET /settings` endpoint. Each static page's `generateMetadata` (or `metadata` export) checks for an admin-configured value and falls back to the current hardcoded default.

### Sitemap
- **D-10:** Dynamic sitemap — static routes + all product slugs + all published blog post slugs.
- **D-11:** Implemented as `frontend/app/sitemap.ts` (Next.js App Router built-in convention). Fetches product slugs and blog slugs from the backend API at request time. Always in sync when new content is published.
- **D-12:** Included pages: `/`, `/about`, `/contact`, `/blog`, `/events`, `/products`, `/products/[slug]` × all products, `/blog/[slug]` × all published posts.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/ROADMAP.md` §Phase 6 — Goal, success criteria (4 items), requirements SEO-01 and SEO-02
- `.planning/REQUIREMENTS.md` §SEO — SEO-01 (scripts injection), SEO-02 (per-page meta); also INFRA-03/04 for admin auth pattern

### Design System & Scope
- `.planning/SCOPE-DECISIONS.md` — Binding decisions on design, UX principles, and what's in/out of scope

### Existing Code to Read Before Planning
- `backend/src/services/settings.service.ts` — `upsertSetting` / `getAllSettings` to reuse for storing SEO keys
- `backend/src/routes/settings.ts` — existing settings routes; SEO settings will be stored via the same PUT `/settings` endpoint
- `backend/src/controllers/settings.controller.ts` — controller pattern to follow
- `frontend/app/layout.tsx` — root layout where `seo_head_scripts` injection goes and where fallback metadata is defined
- `frontend/app/(site)/layout.tsx` — site layout pattern (fetches settings, passes to components)
- `admin/src/pages/Settings.tsx` — existing admin settings page — follow its form/mutation pattern exactly for the new SEO page
- `admin/src/App.tsx` — add new `/seo` route here
- `admin/src/components/layout/Sidebar.tsx` — add "SEO" nav entry here

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/services/settings.service.ts` (`upsertSetting`, `getAllSettings`): directly reused — no new service layer needed for SEO settings storage
- `admin/src/pages/Settings.tsx`: the `GeneralSettingsForm` pattern (useQuery + useMutation + local state + save button) is the exact pattern to follow for the SEO page
- `admin/src/components/ui/input.tsx`, `label.tsx`, `button.tsx`: reuse in SEO form
- `frontend/lib/api.ts` (`getSettings`): already fetches all settings — per-page meta keys will be available without a new endpoint

### Established Patterns
- Settings are stored as flat key-value in the `settings` MySQL table; new SEO keys follow the same convention
- Frontend pages that need dynamic metadata already use `generateMetadata` (see `frontend/app/(site)/blog/[slug]/page.tsx`); static pages that currently export `metadata` directly will be updated to `generateMetadata` that reads settings
- Admin mutations go through `PUT /settings` with a `Record<string, string>` body — no new endpoint needed for SEO config

### Integration Points
- `frontend/app/layout.tsx` → add `dangerouslySetInnerHTML` block for `seo_head_scripts` after fetching settings
- Each static page in `frontend/app/(site)/` → update to `generateMetadata` that checks `meta_title_{path}` / `meta_desc_{path}` settings key, falling back to current default
- `frontend/app/sitemap.ts` → new file; fetches `/api/products` and `/api/blog` slugs from backend
- `admin/src/App.tsx` → add `<Route path="/seo" element={<SeoPage />} />`
- `admin/src/components/layout/Sidebar.tsx` → add "SEO" nav link

</code_context>

<specifics>
## Specific Ideas

- Admin navigation path for scripts: "SEO > Head Scripts" (matches success criteria wording "SEO > Scripts")
- The per-page meta table in admin: one row per page, columns: Page, Meta Title (input), Meta Description (textarea), saved together on a single "Save" button
- `dangerouslySetInnerHTML` for script injection is intentional and acceptable given the auth constraint — note this explicitly in code

</specifics>

<deferred>
## Deferred Ideas

- Per-product SEO meta overrides (products/[slug]) — dynamic pages already use product name/description as meta; override fields could be added to the product edit form in a future pass
- Open Graph image field per page
- robots.txt management via admin
- Structured data (JSON-LD) per page

None came from discussion scope creep — listed for awareness only.

</deferred>

---

*Phase: 6-SEO & Admin Configuration*
*Context gathered: 2026-06-16*

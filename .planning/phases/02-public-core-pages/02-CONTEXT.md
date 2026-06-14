# Phase 2: Public Core Pages - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Home, About, and Contact pages live on `/frontend` (Next.js), built on top of the Phase 1 design system. Includes: site-wide floating WhatsApp icon (number from settings), Buildera footer credit on every page, and the Admin Settings > General UI (deferred from Phase 1 D-11) so the client can configure contact info post-launch.

Phase 2 does NOT include: product pages (Phase 3), lead pipeline admin UI (Phase 4), admin-managed testimonials/blog/events (Phase 5), or SEO meta/scripts admin (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Home Page Sections
- **D-01:** Home page follows a 6-section B2B conversion flow (mirrors aromamonk.com structure):
  1. **Hero** — glassmorphism Get Quote form over full-width stock photo + gradient overlay
  2. **Stats bar** — narrow trust strip: Founded 2019 · 4.7★ Google · Kanpur-based manufacturer (data from `.planning/research/BUSINESS-INFO.md`)
  3. **Products teaser** — 4–6 product category cards with "View All Products" CTA (links ready for Phase 3 product pages)
  4. **Why RSG features grid** — 3–4 USP cards using the existing `GlassCard` component (e.g. Quality, Fast Delivery, Full Range, Trusted)
  5. **Client logo strip** — partner/client logos (Tata Steel + others from `.planning/research/ASSET-INVENTORY.md`)
  6. **Testimonials placeholder** — aggregate rating badges (Google 4.7★, IndiaMART ~4.0★, Justdial 4.3★) + 2–3 hardcoded real review quotes from `.planning/research/BUSINESS-INFO.md`

### Hero Background Assets
- **D-02:** Home hero background = high-quality free stock photo (Unsplash or Pexels) of a steel manufacturing facility or roofing installation, sourced by the researcher. Gradient overlay (navy→steel-blue→cyan) applied on top. No placeholder gradient-only approach — premium look from day one.
- **D-03:** About page does NOT use a photo hero — gradient-only background (navy→steel-blue gradient). About is narrative-focused; a full photo hero would compete with leadership portrait photos further down the page.

### About Page Structure
- **D-04:** About page sections (mirroring current rsgprofilesheets.com About page):
  1. **Hero banner** — company tagline over gradient background
  2. **Company overview** — founding story (2019, Dada Nagar Kanpur), narrative from current site wording
  3. **Mission / Vision / Values** — 3 blocks using `GlassCard` component
  4. **Leadership bios** — CEO Mr. Shivam Gupta + Director Mr. Raman Kumar Gupta with real portrait photos from `.planning/research/ASSET-INVENTORY.md`; use exact current-site wording per SCOPE-DECISIONS.md
  5. **Client logo strip** — same component as Home logo strip
- **D-05:** "Our Process" section is **skipped in Phase 2** — current site icons are non-reusable WordPress theme stock icons. If added in a future phase, it requires custom SVG icons or real factory photography.

### Contact Form UX
- **D-06:** On successful form submission → **inline success message** replaces the form area: "Thank you! We'll be in touch within 24 hours." Visitor stays on the Contact page; no redirect.
- **D-07:** If the n8n webhook call fails (network error, timeout, non-2xx) → **show success anyway**. The lead is already written to the DB — that is the source of truth. Webhook failure is invisible to the visitor. Admin still sees the lead in their Leads list.
- **D-08:** Contact form includes a "Product" dropdown listing all 10 product categories + "General Inquiry" option (per REQUIREMENTS.md PUBLIC-03 and SCOPE-DECISIONS.md). Submission is recorded in the `leads` table AND posted to `LEAD_WEBHOOK_URL`.

### Admin Settings > General UI
- **D-09:** Phase 2 delivers the **Settings > General** admin page (deferred from Phase 1 D-11). It exposes these editable fields:
  - WhatsApp number (feeds the floating icon)
  - Business email (feeds Contact page / footer placeholder)
  - Business address (feeds Contact page)
  - Business hours (feeds Contact page — default: Mon–Sat 10 AM–6 PM, Closed Sunday)
  - Business phone (feeds Contact page)
  - Fields use seeded defaults from BUSINESS-INFO.md where available; WhatsApp number seeds empty (client fills post-launch).
- **D-10:** The Contact page reads **all contact data live from the settings API** (`GET /api/settings`). No hardcoded fallback in component code — if a field is empty in settings, the page shows the seeded default from the DB (not duplicated in source). Single source of truth: admin edit → site updates.
- **D-11:** Social links (Instagram, LinkedIn, Facebook) are **NOT** included in Phase 2 Settings UI. They are either hardcoded in the footer component or deferred — not worth the admin UI scope for Phase 2.

### Claude's Discretion
- Exact product categories shown in the Home products teaser (4–6 cards — planner picks the most visually strong categories)
- Exact wording for the "Why RSG" features grid USPs
- Layout/ordering of the Contact page sections (form left, map right vs stacked)
- WhatsApp floating icon design (bottom-right corner, fixed, standard WhatsApp green icon)
- Footer layout (single-row vs multi-column, exact social link inclusion decision)
- Stock photo selection (researcher sources from Unsplash/Pexels; "steel roofing manufacturing", "metal sheet factory", "roofing construction" search terms)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Direction & Scope (locked decisions)
- `.planning/SCOPE-DECISIONS.md` — "Premium Industrial" design direction (gradients, glassmorphism, fonts, color rhythm, layout/whitespace rules), WhatsApp handling, footer credit, testimonials approach, contact/email placeholders, lead webhook integration, 10-product catalog list
- `.planning/PROJECT.md` — monorepo structure, tech stack constraints, contact info placeholders
- `.planning/REQUIREMENTS.md` — PUBLIC-01..05 requirement definitions for Phase 2

### Content & Asset Sources
- `.planning/research/ASSET-INVENTORY.md` — leadership portrait photos (Shivam Gupta, Raman Kumar Gupta), client logo sources (tata-steel-logo.png), current-site product photo quality assessment
- `.planning/research/BUSINESS-INFO.md` — company address/hours/phone, Google/IndiaMART/Justdial rating data, real review quotes for testimonials placeholder, social profile URLs

### Phase 1 Foundation (already built)
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` — D-06 (public site = custom Tailwind, no shadcn), D-11/D-12 (settings table scope, which keys were seeded in Phase 1), existing component list

### Architecture & Stack
- `.planning/research/ARCHITECTURE.md` — layered Express API pattern, settings GET endpoint pattern
- `.planning/research/STACK.md` — confirmed library choices (Next.js 15, Express, mysql2, Tailwind)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/components/layout/GlassCard.tsx` — use for the Home features grid cards, About Mission/Vision/Values cards, and any stat/highlight panels
- `frontend/components/layout/GradientHero.tsx` — use for the Home hero section (pass stock photo as background prop) and About hero (gradient-only mode)
- `frontend/components/layout/CTAButton.tsx` — use for all "Get Quote" and "View All Products" calls to action
- `frontend/components/layout/SectionContainer.tsx` — wraps every page section (max-width, gutters, vertical spacing)

### Established Patterns
- Public site = fully custom Tailwind components; no shadcn/ui imports in `/frontend`
- Admin uses shadcn/ui components (tables, forms, dialogs) themed with RSG palette
- Settings data is stored as key-value rows in the `settings` MySQL table; accessed via `GET /api/settings` (backend)

### Integration Points
- WhatsApp floating icon reads `whatsapp_number` from settings API on page load; renders as a fixed bottom-right component in the shared layout
- Contact form POSTs to `/api/leads` (backend), which saves to `leads` table AND fires `LEAD_WEBHOOK_URL` (n8n). Webhook failure does not block the DB write or the success response to the user.
- Admin Settings > General page calls `GET /api/settings` to pre-fill, then `PUT /api/settings` to save
- Footer Buildera credit is part of the shared layout — renders on every public page automatically

</code_context>

<specifics>
## Specific Ideas

- **Aroma Monk reference** — user explicitly referenced aromamonk.com as the structural/conversion benchmark for the Home page layout. The 6-section flow mirrors how that site guides visitors from hero → social proof → CTA.
- **Current RSG website reference** — About page content (company narrative, leadership bios, Mission/Vision/Values wording) should closely follow the current rsgprofilesheets.com About page text. Do NOT invent new copy; adapt what's there.
- **Leadership photos** — real portrait photos already exist for both CEO and Director (confirmed usable quality in ASSET-INVENTORY.md). Use these on the About page as-is.
- **Testimonials hardcoded for Phase 2** — since Phase 5 builds admin-managed testimonials, Phase 2 hardcodes 2–3 real review quotes from BUSINESS-INFO.md (Shivkant Dixit, Arvind Yadav, Vijay Prajapati) as static content. The component should be structured so Phase 5 can swap hardcoded data for an API call without redesigning the section.

</specifics>

<deferred>
## Deferred Ideas

- **Social links in Admin Settings** — Instagram/LinkedIn/Facebook URL fields in Settings > General deferred beyond Phase 2. Footer can use hardcoded social links for now (or no social links initially).
- **"Our Process" section on About page** — skipped Phase 2. Requires custom icons or real factory photography neither of which is available. Can be added as a Phase 5/6 enhancement if client supplies assets.
- **/thank-you redirect page** — considered for Contact form submission; deferred. If GA conversion tracking is needed later, a thank-you page can be added in Phase 6 (SEO phase) alongside GA script injection.

</deferred>

---

*Phase: 2-public-core-pages*
*Context gathered: 2026-06-14*

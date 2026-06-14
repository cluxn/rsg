# Requirements: RSG Profile Manufacturing — Website & Admin Panel

**Defined:** 2026-06-14
**Core Value:** A visitor researching roofing/structural steel suppliers should immediately perceive RSG as a credible, established, premium manufacturer — and be guided, without friction, into submitting a "Get Quote" lead.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure (INFRA)

- [ ] **INFRA-01**: Monorepo scaffolded with `/frontend` (Next.js App Router), `/backend` (Node.js/Express API), `/admin` (React + Vite SPA), each runnable locally via `npm run dev`
- [ ] **INFRA-02**: MySQL database schema created (via SQL migration scripts) covering products, pages, leads, media, blog posts, events, testimonials, settings, and admin users
- [ ] **INFRA-03**: Admin can log in to the admin panel (served at `rsgprofilesheets.com/admin`) using credentials seeded during setup
- [ ] **INFRA-04**: All admin CRUD API endpoints reject requests without a valid admin session (JWT)

### Design System (DESIGN)

- [ ] **DESIGN-01**: Public site renders using the "Premium Industrial" design system — Sora/Source Sans 3 fonts, navy→steel-blue→cyan gradients, glassmorphism panels, burnt-orange/red accent — per `.planning/SCOPE-DECISIONS.md`
- [ ] **DESIGN-02**: All public pages follow the shared layout grid (max-width container ~1280-1320px, defined gutters, 96-128px desktop / 48-64px mobile section spacing)
- [ ] **DESIGN-03**: Public site text meets WCAG AA contrast and minimum 16-18px body text / 15-16px spec/label text per `.planning/SCOPE-DECISIONS.md`

### Public Pages (PUBLIC)

- [ ] **PUBLIC-01**: Visitor can view the Home page with a glassmorphism "Get Quote" hero form-over-image, client/partner logo section, and testimonials summary
- [ ] **PUBLIC-02**: Visitor can view the About page with company narrative (founded 2019, Kanpur), leadership bios for CEO Shivam Gupta and Director Raman Kumar Gupta (using current-site wording), and the client logo strip
- [ ] **PUBLIC-03**: Visitor can view the Contact page with business address, hours, a contact form (including a "Product" dropdown to select which product the inquiry relates to), and an embedded Google Map; submissions are sent to the configured n8n lead webhook (`LEAD_WEBHOOK_URL`) and recorded as a lead
- [ ] **PUBLIC-04**: Visitor sees a floating WhatsApp contact icon on every page, linking to `wa.me/<admin-configured number>` (hidden or inert if no number is configured)
- [ ] **PUBLIC-05**: Every public page's footer includes "Developed and managed by Buildera Technologies LLP" with a do-follow link to buildera.co

### Product Catalog (CATALOG)

- [ ] **CATALOG-01**: Visitor can view each of the 10 product category pages — Colour Coated Roofing Sheet, MS Plate/Channel/Angle, MS Pipe, Decking Sheet, Purlins, Polycarbonate Sheet, Crimping Sheet, Self Drilling Screws, Turbo Air Ventilator, Accessories — each with description, specs, and images
- [ ] **CATALOG-02**: Every product category page includes a "Get Quote" call-to-action
- [ ] **CATALOG-03**: Admin can edit each product page's description, specs, and images via the admin panel

### Media Library (MEDIA)

- [ ] **MEDIA-01**: Admin can upload, view, and delete media files in a Media Library
- [ ] **MEDIA-02**: Every media item requires a non-empty alt text field before it can be saved/used

### Lead Capture (LEAD)

- [ ] **LEAD-01**: Visitor can submit a "Get Quote" form (name, contact info, product/category, message) from the Home page and any product page; each submission is also POSTed to the configured n8n lead webhook (`LEAD_WEBHOOK_URL`)
- [ ] **LEAD-02**: Each lead submission records its source (which page/product it was submitted from)
- [ ] **LEAD-03**: Admin can view all lead submissions as a flat list (no pipeline stages), with source visible per lead
- [ ] **LEAD-04**: Admin can export all leads to CSV and import leads from a CSV file

### Content & Testimonials (CONTENT)

- [ ] **CONTENT-01**: Admin can create, edit, and delete Blog posts; visitor can view a Blog list page and individual post pages
- [ ] **CONTENT-02**: Admin can create, edit, and delete Events/News entries; visitor can view them on the public site
- [ ] **CONTENT-03**: Visitor sees a Testimonials section (Home + About) showing aggregate rating badges (Google 4.7★, IndiaMART ~4.0★, Justdial 4.3★) and 3-4 real review quotes (name + city)
- [ ] **CONTENT-04**: Admin can add, edit, and delete testimonials (text, name, city, rating, source)

### SEO & Admin Configuration (SEO)

- [ ] **SEO-01**: Admin can paste arbitrary `<script>` snippets into a "Scripts" field that renders in the `<head>` of every public page (ships with none configured)
- [ ] **SEO-02**: Admin can edit the meta title and meta description for each public page

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Guides / Lead Magnets (GUIDE)

- **GUIDE-01**: Admin can create gated "Guide" content (PDF downloads) and visitors can request access via a form — sample content shape documented in `.planning/content-samples/`, deferred until real gated content exists

## v1.x (Built Last, Within v1 Scope)

### Lead Notifications (NOTIF)

- [ ] **NOTIF-01**: System sends an email (SMTP via nodemailer) to a configured address when a new lead is submitted — built last, after core site/admin functionality is complete, per `.planning/SCOPE-DECISIONS.md`. (The n8n lead webhook is a separate, fixed integration wired in via LEAD-01/PUBLIC-03 — see SCOPE-DECISIONS.md.)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Newsletter signup (anywhere on site or admin) | Explicitly excluded by client — no email-marketing infrastructure planned |
| Standalone "Client Logos" page | Folded into Home/About sections instead |
| Case Studies page | Explicitly excluded by client — no case-study content exists |
| Built-in analytics dashboard | Client pastes GA/GTM via admin SEO > Scripts field post-launch instead |
| Public pricing (per-kg or otherwise) | "Get Quote" only — keeps premium B2B positioning vs. commodity-marketplace pricing seen on IndiaMART |
| Lead pipeline/funnel stages, Meetings | Leads stay a flat list with source tracking + export/import only |
| Real-time chat / live support | Not requested; WhatsApp click-to-chat covers direct contact |
| Guides / gated lead-magnet PDFs | Deferred to v2 (GUIDE-01) — no real gated content exists yet |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| DESIGN-01 | Phase 1 | Pending |
| DESIGN-02 | Phase 1 | Pending |
| DESIGN-03 | Phase 1 | Pending |
| PUBLIC-01 | Phase 2 | Pending |
| PUBLIC-02 | Phase 2 | Pending |
| PUBLIC-03 | Phase 2 | Pending |
| PUBLIC-04 | Phase 2 | Pending |
| PUBLIC-05 | Phase 2 | Pending |
| CATALOG-01 | Phase 3 | Pending |
| CATALOG-02 | Phase 3 | Pending |
| CATALOG-03 | Phase 3 | Pending |
| MEDIA-01 | Phase 3 | Pending |
| MEDIA-02 | Phase 3 | Pending |
| LEAD-01 | Phase 4 | Pending |
| LEAD-02 | Phase 4 | Pending |
| LEAD-03 | Phase 4 | Pending |
| LEAD-04 | Phase 4 | Pending |
| CONTENT-01 | Phase 5 | Pending |
| CONTENT-02 | Phase 5 | Pending |
| CONTENT-03 | Phase 5 | Pending |
| CONTENT-04 | Phase 5 | Pending |
| SEO-01 | Phase 6 | Pending |
| SEO-02 | Phase 6 | Pending |
| NOTIF-01 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-14*
*Last updated: 2026-06-14 after roadmap creation*

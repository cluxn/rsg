# Roadmap: RSG Profile Manufacturing — Website & Admin Panel

## Overview

This roadmap takes the project from an empty monorepo to a fully launchable B2B lead-generation site. Phase 1 builds the shared foundation (monorepo scaffold, MySQL schema, admin auth, settings table, ISR revalidation, and the "Premium Industrial" design system) so every later phase builds on solid, consistent groundwork. Phases 2-3 deliver the public-facing core — Home/About/Contact and the 10-page product catalog with its Media Library — establishing the site's credibility and content depth. Phase 4 closes the loop on the site's core purpose: lead capture, feeding a flat admin Leads list. Phases 5-6 round out content marketing (Blog/Events/Testimonials) and SEO configurability. Phase 7 adds lead notifications last, per the client's own sequencing decision, once the rest of the system is proven stable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Design System** - Monorepo scaffold, DB schema, admin auth, settings, ISR revalidation, design tokens
- [x] **Phase 2: Public Core Pages** - Home, About, Contact, WhatsApp icon, footer credit
- [x] **Phase 3: Product Catalog & Media Library** - 10 product category pages + admin CRUD + Media Library with alt text
- [x] **Phase 4: Lead Capture & Admin Leads** - Get Quote form, source tracking, admin Leads list with export/import
- [x] **Phase 5: Blog, Events & Testimonials** - Admin CMS + public pages for Blog/Events, Testimonials section
- [x] **Phase 6: SEO & Admin Configuration** - SEO scripts injection, per-page meta, sitemap
- [ ] **Phase 7: Lead Notifications** - SMTP/n8n notifications on new leads (built last)

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: A locally runnable monorepo (`/frontend`, `/backend`, `/admin`) with the database schema, admin authentication, a configurable settings table, on-demand ISR revalidation, and the "Premium Industrial" design system (fonts, colors, gradients, glassmorphism components, layout grid) in place — ready for content pages to be built on top.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, DESIGN-01, DESIGN-02, DESIGN-03
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts `/frontend` (Next.js), `/backend` (Express), and `/admin` (Vite) locally
  2. MySQL schema (via SQL migration scripts) includes tables for products, pages, leads, media, blog posts, events, testimonials, settings, and admin users
  3. Admin can log in at `/admin` with seeded credentials and reach an authenticated dashboard shell
  4. A test page rendered with the shared layout shows Sora/Source Sans 3 fonts, the navy-steel-cyan gradient, a glassmorphism panel, and the defined gutter/spacing grid
  5. Calling the revalidation endpoint causes a previously-built static page to regenerate
**Plans**: TBD

### Phase 2: Public Core Pages
**Goal**: Visitors can browse the Home, About, and Contact pages built on the Phase 1 design system, with a site-wide floating WhatsApp icon (reading from settings) and footer credit on every page.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PUBLIC-01, PUBLIC-02, PUBLIC-03, PUBLIC-04, PUBLIC-05
**Success Criteria** (what must be TRUE):
  1. Visitor can view the Home page with a glassmorphism Get Quote hero, client logo section, and testimonials summary placeholder
  2. Visitor can view the About page with leadership bios (Shivam Gupta, Raman Kumar Gupta) and client logo strip
  3. Visitor can view the Contact page with address, hours, contact form, and embedded Google Map
  4. A floating WhatsApp icon appears on every page and links to `wa.me/<configured number>`, or is hidden if no number is set in admin settings
  5. Every page's footer shows "Developed and managed by Buildera Technologies LLP" linking to buildera.co (do-follow)
**Plans**: TBD

### Phase 3: Product Catalog & Media Library
**Goal**: All 10 product category pages are live with real specs/images sourced per `.planning/research/ASSET-INVENTORY.md`, manageable via admin CRUD, with a Media Library enforcing mandatory alt text on every image.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: CATALOG-01, CATALOG-02, CATALOG-03, MEDIA-01, MEDIA-02
**Success Criteria** (what must be TRUE):
  1. Visitor can view each of the 10 product category pages (Colour Coated Roofing Sheet, MS Plate/Channel/Angle, MS Pipe, Decking Sheet, Purlins, Polycarbonate Sheet, Crimping Sheet, Self Drilling Screws, Turbo Air Ventilator, Accessories) with description, specs, and images
  2. Every product page shows a "Get Quote" CTA
  3. Admin can edit a product page's description, specs, and images and see the change reflected on the public page within seconds
  4. Admin can upload a media file and cannot save it without entering alt text
  5. Product page content matches the current-site catalog structure from `.planning/SCOPE-DECISIONS.md` (no IndiaMART-style per-kg pricing or 8-category grouping)
**Plans**: TBD

### Phase 4: Lead Capture & Admin Leads
**Goal**: The site's primary conversion path works end-to-end — visitors submit "Get Quote" requests from Home and any product page, and admin sees them as a flat, exportable/importable list with source tracking and basic spam protection.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04
**Success Criteria** (what must be TRUE):
  1. Visitor can submit the Get Quote form from the Home page and from any product page
  2. Each submitted lead records which page/product it came from
  3. Admin sees all leads in a flat list (no pipeline stages) with source visible per lead
  4. Admin can export all leads to CSV and import leads from a CSV file
  5. Rapid/automated form submissions are caught by a honeypot or rate limit instead of flooding the leads list
  6. Each lead submission is also POSTed to the configured n8n lead webhook (`LEAD_WEBHOOK_URL`)
**Plans**: TBD

### Phase 5: Blog, Events & Testimonials
**Goal**: The site supports ongoing content marketing and social proof — admin can publish Blog posts and Events/News, and the Home/About pages show real testimonials with aggregate rating badges.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04
**Success Criteria** (what must be TRUE):
  1. Admin can create, edit, and delete a Blog post; visitor can view it on a Blog list page and its own detail page
  2. Admin can create, edit, and delete an Events/News entry; visitor can view it on the public site
  3. Home and About pages show aggregate rating badges (Google 4.7★, IndiaMART ~4.0★, Justdial 4.3★) and 3-4 real review quotes with name + city
  4. Admin can add, edit, and delete a testimonial (text, name, city, rating, source) and see it reflected on the public site
**Plans**: TBD

### Phase 6: SEO & Admin Configuration
**Goal**: Admin can configure SEO without developer involvement — arbitrary tracking scripts and per-page meta tags — completing the site's launch-readiness.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: SEO-01, SEO-02
**Success Criteria** (what must be TRUE):
  1. Admin can paste a script snippet into SEO > Scripts and it appears in the `<head>` of every public page in production HTML
  2. Site ships with no scripts configured by default
  3. Admin can edit meta title/description for any public page and see it reflected in that page's HTML `<head>`
  4. A sitemap.xml is available listing all public pages
**Plans**: TBD

### Phase 7: Lead Notifications
**Goal**: Admin (and optionally an n8n workflow) is notified automatically when a new lead is submitted, completing the lead pipeline without manual checking.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: NOTIF-01
**Success Criteria** (what must be TRUE):
  1. Submitting a Get Quote form triggers an SMTP email to the admin-configured address
  2. Notification failures do not block the lead from being saved
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 4/4 | Complete | 2026-06-14 |
| 2. Public Core Pages | 3/3 | Complete | 2026-06-14 |
| 3. Product Catalog & Media Library | 4/4 | Complete | 2026-06-15 |
| 4. Lead Capture & Admin Leads | 3/3 | Complete | 2026-06-15 |
| 5. Blog, Events & Testimonials | 4/4 | Complete | 2026-06-16 |
| 6. SEO & Admin Configuration | 3/3 | Complete | 2026-06-16 |
| 7. Lead Notifications | 0/TBD | Not started | - |

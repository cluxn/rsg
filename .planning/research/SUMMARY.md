# Project Research Summary

**Project:** RSG Profile Manufacturing — Website & Admin Panel
**Domain:** B2B industrial catalog website + admin CMS (manufacturing/roofing sector)
**Researched:** 2026-06-14
**Confidence:** HIGH

## Executive Summary

This is a content-driven B2B lead-generation site for a Kanpur steel/roofing manufacturer, paired with a small admin CMS so the client can manage products, blog/events, testimonials, leads, and a handful of configurable settings (WhatsApp number, SEO scripts) without developer involvement. The domain is well-understood: a Next.js (App Router, SSG/ISR) public site, a Node.js/Express REST API backed by MySQL, and a React+Vite admin SPA — all within one monorepo, deployable to a single VPS via PM2 + nginx. This matches the client's explicit tech constraints (Node.js required, MySQL required, monorepo, admin at `/admin`).

The recommended approach is a vertical-slice (MVP-mode) roadmap: build the foundation (monorepo, DB schema, admin auth, design system, ISR revalidation plumbing) first, then layer in public pages, the product catalog, lead capture, content CMS, and SEO — each phase delivering a working, demoable increment. Lead notifications (SMTP/n8n) are deliberately last, per the client's own sequencing decision in SCOPE-DECISIONS.md.

The main risks are: (1) the "Premium Industrial" design system being underbuilt and the site looking like "just another WordPress template" — mitigated by establishing design tokens and image-role guidelines in Phase 1 before any page is built; (2) configurable values (WhatsApp number, contact email, SEO scripts) getting hardcoded for expediency — mitigated by building the `settings` table and admin Settings screen in Phase 1; and (3) ISR cache staleness making the CMS feel broken — mitigated by building on-demand revalidation in Phase 1 and wiring every content phase to it.

## Key Findings

### Recommended Stack

Next.js 15 (App Router, TypeScript, Tailwind) for the public site; Node.js 20 + Express 4 + mysql2 + MySQL 8 for the API; React 18 + Vite 5 + TanStack Query for the admin SPA. Supporting libraries: React Hook Form + Zod (forms/validation), Multer + sharp (media uploads/responsive images), Tiptap (blog/events rich text), jsonwebtoken + bcrypt (admin auth), nodemailer + csv-parse/stringify (Phase 7 notifications, leads export/import). Full detail in `STACK.md`.

**Core technologies:**
- Next.js 15 (App Router): public site rendering — SSG/ISR for fast, SEO-friendly catalog/blog pages
- Express 4 + mysql2 + MySQL 8: single backend API serving both public reads and admin CRUD, per client's Node.js requirement — raw parameterized queries, no ORM
- React 18 + Vite 5: admin SPA, served at `/admin`

### Expected Features

Full detail in `FEATURES.md`.

**Must have (table stakes):**
- 10 product category pages with specs (per SCOPE-DECISIONS.md Product Catalog Structure)
- Get Quote lead form on Home + every product page
- Mobile-responsive layout, basic SEO (meta tags, sitemap)
- Admin CMS for products, blog, events, testimonials, media, leads

**Should have (competitive):**
- "Premium Industrial" visual design (gradients, glassmorphism, large photography)
- Real review aggregation (Google/IndiaMART/Justdial badges + quotes)
- Configurable WhatsApp floating contact, admin-managed SEO script injection

**Defer (v2+):**
- Guides / gated lead-magnet PDF library (sample structure exists in `.planning/content-samples/`, no real content yet)

### Architecture Approach

Three-app monorepo (`/frontend` Next.js, `/backend` Express+mysql2+MySQL, `/admin` React+Vite), all talking to a single Express API as the source of truth — `/frontend` never queries MySQL directly. Public content uses ISR with on-demand revalidation triggered from `/backend` after admin saves. A `settings` key-value table holds all post-launch-configurable values (WhatsApp number, contact info, SEO scripts). Full detail in `ARCHITECTURE.md`.

**Major components:**
1. `/backend` (Express API) — owns MySQL via mysql2 (parameterized queries), auth, validation, media processing, revalidation triggers
2. `/frontend` (Next.js) — renders all public pages via SSG/ISR, fetches from `/backend`
3. `/admin` (React+Vite SPA) — authenticated CRUD UI for all content types, served at `/admin`

### Critical Pitfalls

Full detail in `PITFALLS.md`.

1. **Hardcoding configurable contact info (WhatsApp number, email, SEO scripts)** — build the `settings` table + admin Settings screen in Phase 1, before any component needs these values
2. **IndiaMART catalog structure leaking into the new site** — current site (not IndiaMART) is the structural source of truth for all 10 product pages; IndiaMART is contact/rating data only
3. **ISR cache staleness after admin edits** — build the on-demand revalidation endpoint in Phase 1 and wire every content-saving admin handler to call it
4. **Low-resolution source images (300x300) used at hero scale** — establish image-role guidelines (thumbnail vs. hero) in Phase 1 before building page templates
5. **Admin script-injection pattern leaking into other rich-text fields (XSS risk)** — scope raw HTML rendering to exactly one field (SEO scripts), sanitize everything else (Tiptap output)

## Implications for Roadmap

Based on research, suggested phase structure (vertical MVP slices — each phase delivers a working, demoable increment):

### Phase 1: Foundation & Design System
**Rationale:** Everything else depends on the monorepo scaffold, DB schema, admin auth, settings table, ISR revalidation endpoint, and design tokens — building these first prevents rework and addresses Pitfalls 1, 3, and 4 before any page exists.
**Delivers:** Working `/frontend`, `/backend`, `/admin` apps (locally runnable), MySQL schema + migrations, admin login, settings table + Settings screen, shared Tailwind design tokens (Sora/Source Sans 3, navy-steel-cyan gradients, glassmorphism components), ISR revalidate endpoint.
**Addresses:** INFRA-*, DESIGN-* requirements
**Avoids:** Pitfalls 1 (hardcoded config), 3 (ISR staleness), 4 (image guidelines)

### Phase 2: Public Core Pages
**Rationale:** With the design system and settings in place, the highest-credibility public pages (Home, About, Contact) can be built next — these establish the site's first impression and the global layout (header/footer/WhatsApp icon) reused by every later page.
**Delivers:** Home, About, Contact pages using the design system; WhatsApp floating icon (reading from settings); footer with Buildera credit link.
**Uses:** Design tokens and settings table from Phase 1
**Implements:** Shared layout/template component from ARCHITECTURE.md

### Phase 3: Product Catalog & Media Library
**Rationale:** The product catalog is the core content of the site and the largest content-authoring task (10 pages); Media Library with mandatory alt text must exist before product images can be properly managed. Building this after the shared layout (Phase 2) means each product page reuses established templates.
**Delivers:** All 10 product category pages (per SCOPE-DECISIONS.md), admin CRUD for product content, Media Library with mandatory alt text field.
**Addresses:** CATALOG-*, MEDIA-* requirements
**Avoids:** Pitfall 2 (IndiaMART structure leakage), Pitfall 4 (low-res hero images)

### Phase 4: Lead Capture & Admin Leads
**Rationale:** With product pages in place (each needing a Get Quote CTA), the lead capture mechanism — the site's core conversion goal — can be wired end-to-end: form → backend → admin leads list.
**Delivers:** Get Quote form (Home + product pages) with source tracking, admin Leads flat list, CSV export/import, basic spam mitigation (honeypot/rate-limit).
**Addresses:** LEAD-* requirements
**Avoids:** Pitfall 6 (lead spam before notifications exist)

### Phase 5: Blog, Events & Testimonials CMS
**Rationale:** With the core lead-gen site live, content-marketing and trust-building features (blog, events/news, testimonials) round out the site. These are independent of the product catalog and lead form, so they can follow rather than block earlier phases.
**Delivers:** Admin CRUD + public pages for Blog and Events/News (Tiptap rich text), Testimonials section (Home + About) with real review quotes/badges and admin CRUD.
**Addresses:** CONTENT-* requirements

### Phase 6: SEO & Admin Polish
**Rationale:** SEO scripts injection and per-page meta tags are low-complexity but benefit from being layered onto a complete site (all page types exist by now to apply meta to). This phase also closes out the single sanctioned raw-HTML render point.
**Delivers:** SEO > Scripts admin field rendered in `<head>`, per-page meta title/description editable via admin, sitemap.xml.
**Addresses:** SEO-* requirements
**Avoids:** Pitfall 5 (script injection scope creep)

### Phase 7: Lead Notifications
**Rationale:** Explicitly sequenced last per SCOPE-DECISIONS.md ("build last, after core site/admin works") — by this point leads are flowing and the admin can configure SMTP/webhook settings with confidence the rest of the system is stable.
**Delivers:** SMTP email notification on new lead (nodemailer), optional n8n webhook notification, both configurable via Settings.
**Addresses:** NOTIF-* requirements

### Phase Ordering Rationale

- Foundation-first ordering prevents the three biggest pitfalls (hardcoded config, ISR staleness, image misuse) from being baked into early pages
- Public core pages before the product catalog establishes the shared layout/template once, so all 10 product pages (the largest content task) reuse it rather than each reinventing structure
- Lead capture follows the product catalog because every product page needs the Get Quote CTA as a dependency
- Content/CMS (blog/events/testimonials) and SEO are independent enough to follow the core conversion path without blocking it
- Lead notifications last matches the client's own explicit sequencing decision

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** SQL schema design for `settings` (key-value vs. typed) and the on-demand revalidation auth pattern — worth a quick design-phase check, though both are well-documented patterns
- **Phase 3:** Per-category spec data structure (some categories have rich spec tables, others thin copy per ASSET-INVENTORY.md) — may need a flexible JSON-column approach for specs rather than rigid columns

Phases with standard patterns (skip research-phase):
- **Phase 2:** Standard marketing page build (Home/About/Contact) — well-documented Next.js patterns
- **Phase 4:** Standard lead-form-to-database pattern with CSV export — well-documented
- **Phase 7:** nodemailer SMTP integration — well-documented, low complexity

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Directly matches client-specified constraints (Next.js, Node.js, MySQL, Vite admin); all libraries are mainstream/current |
| Features | HIGH | Derived directly from PROJECT.md and SCOPE-DECISIONS.md — already client-validated |
| Architecture | HIGH | Standard monorepo/REST/ISR pattern for this exact app shape; no novel integrations |
| Pitfalls | HIGH | Pitfalls derived from specific, documented project constraints (not generic) |

**Overall confidence:** HIGH

### Gaps to Address

- **Product spec data structure (Phase 3):** Whether to use a flexible JSON `specs` column vs. per-category typed tables should be resolved during Phase 3 planning, once each product's actual spec content is reviewed against ASSET-INVENTORY.md
- **VPS deployment specifics (PM2/nginx config):** Not a roadmap blocker, but should be addressed during Phase 1 or at ship time — exact VPS provider/setup not yet confirmed

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — project context, constraints, requirements
- `.planning/SCOPE-DECISIONS.md` — locked design/UX/catalog decisions
- `.planning/config.json` — workflow settings (standard granularity, vertical MVP, parallel execution)

### Secondary (MEDIUM confidence)
- `.planning/research/BUSINESS-INFO.md` — contact/review data for testimonials and contact page
- `.planning/research/ASSET-INVENTORY.md` — current-site asset/content quality assessment

### Tertiary (LOW confidence)
- General Next.js 15 / Express / mysql2 / MySQL ecosystem knowledge (training data) — versions/patterns are current as of early 2025; recommend a quick version check (`npm view next version`, etc.) at Phase 1 execution time

---
*Research completed: 2026-06-14*
*Ready for roadmap: yes*

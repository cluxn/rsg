# Feature Research

**Domain:** B2B industrial catalog website + admin CMS (manufacturing/roofing sector)
**Researched:** 2026-06-14
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy for a B2B manufacturer.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Product category pages with specs | B2B buyers compare specs before contacting; a "manufacturer" site without detailed specs reads as low-credibility | MEDIUM | 10 pages per SCOPE-DECISIONS Product Catalog Structure; specs vary per category (tables, bullet lists) |
| Contact form + business details (address/hours/map) | Buyers need to verify the company is real and reachable | LOW | Address/hours sourced from BUSINESS-INFO.md |
| Mobile-responsive layout | Significant share of B2B traffic is mobile, especially for an older demographic browsing via phone | MEDIUM | Mobile-first per SCOPE-DECISIONS layout/whitespace rules |
| Clear lead-capture CTA ("Get Quote") | Core conversion mechanism — without it there's no path from visitor to lead | MEDIUM | Present on Home + every product page per PROJECT.md |
| About/company page with credibility signals | B2B buyers vet suppliers — founding year, leadership, certifications | LOW | Real bios from current site per ASSET-INVENTORY.md |
| Basic SEO (meta tags, sitemap, fast load) | Organic search is a primary discovery channel for industrial suppliers | MEDIUM | Next.js Metadata API + sitemap.xml route |
| Admin content management (no-code edits) | Client needs to update products/blog/leads without developer involvement post-launch | HIGH | Core driver of the `/admin` SPA + backend API |

### Differentiators (Competitive Advantage)

Features that set this site apart from typical Indian B2B manufacturer sites (which tend to be dated WordPress templates or IndiaMART-style marketplace listings).

| Feature | Value Proposition | Complexity | Notes |
|---------|--------------------|------------|-------|
| "Premium Industrial" visual design (gradients, glassmorphism, large photography) | Signals established/credible manufacturer vs. small/unfinished — directly addresses client's stated goal | HIGH | Full design system per SCOPE-DECISIONS.md |
| Real review aggregation (Google/IndiaMART/Justdial badges + quotes) | Builds trust with verifiable third-party proof, not generic stock testimonials | LOW-MEDIUM | Sourced quotes already in BUSINESS-INFO.md |
| Configurable WhatsApp floating contact | Matches how Indian B2B buyers actually reach suppliers (WhatsApp-first), without hardcoding a number that may change | LOW | Admin-settable per SCOPE-DECISIONS.md |
| Admin-managed SEO script injection (GA/GTM) | Lets client add tracking post-launch without a developer, while keeping launch scope clean | LOW | SEO > Scripts field, rendered in `<head>` |
| Guided-scanning UX (one focal point/CTA per section, F/Z-pattern) | Reduces cognitive load for an older B2B demographic — more conversions per visitor | MEDIUM | Applies to every page template, not a separate feature — bake into Phase 1 design system + page templates |
| Blog + Events/News CMS | Ongoing content marketing/SEO without developer involvement | MEDIUM | Admin CRUD + public list/detail pages |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but were explicitly excluded after consideration.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|----------------|------------------|-------------|
| Public per-kg pricing (IndiaMART-style) | "Let buyers see prices upfront" | Signals commodity marketplace, not premium manufacturer; prices change often and create stale-data risk | "Get Quote" CTA on every product page; pricing handled off-platform |
| Lead pipeline/CRM stages (New/Contacted/Converted/etc.) | "Track sales funnel like a CRM" | Adds significant admin complexity for a small team; client explicitly wants a flat list | Flat leads list with source tracking + CSV export/import — client can use existing CRM/Excel workflow downstream |
| Newsletter signup | "Capture more leads passively" | Requires email infrastructure/compliance (unsubscribe, consent) for a channel the client doesn't plan to use | Get Quote form is the single lead-capture mechanism |
| Standalone Case Studies / Client Logos pages | "More content = more SEO" | Thin/duplicate content with no real case-study material available; client logos fit naturally into Home/About | Client logos folded into Home/About sections |
| Guides / gated lead-magnet PDFs | "Lead magnets boost conversion" | No real gated content exists yet; building the CMS structure for it now adds scope with no content to fill it | Deferred to v2 — sample content shape documented in `.planning/content-samples/` |

## Feature Dependencies

```
Admin Authentication
    └──requires──> Backend API + DB schema (Phase 1)

Product Catalog Pages
    └──requires──> Admin Authentication (to manage product content)
    └──requires──> Media Library (product images)

Get Quote Lead Form
    └──requires──> Product Catalog Pages (source tracking references product/page)
    └──enhances──> Admin Leads List

WhatsApp Floating Icon
    └──requires──> Admin Settings (configurable number)

Testimonials Section
    └──requires──> Admin Authentication (CRUD)
    └──enhances──> Home + About pages

Blog / Events CMS
    └──requires──> Admin Authentication
    └──requires──> Media Library (post images)

SEO Scripts Injection
    └──requires──> Admin Settings + Layout template (renders in <head>)

Lead Email/Webhook Notifications
    └──requires──> Get Quote Lead Form + Admin Leads List (built last per SCOPE-DECISIONS.md)
```

### Dependency Notes

- **Product Catalog Pages require Media Library:** product images must be uploadable/manageable with mandatory alt text before product pages can be considered complete — these belong in the same phase.
- **Get Quote Lead Form enhances Admin Leads List:** the form can technically exist before the admin leads view, but both should ship together so leads aren't "lost" between phases.
- **Lead Notifications require the Lead Form + Leads List:** explicitly sequenced last per SCOPE-DECISIONS.md — "build last, after core site/admin works."
- **SEO Scripts Injection requires a shared layout template:** must be designed into the base page layout from Phase 1 onward so a single render point exists for arbitrary scripts.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for the site to go live and start generating leads.

- [ ] Monorepo foundation (Next.js + Express + MySQL + Vite admin) with admin auth
- [ ] Premium Industrial design system applied to a shared layout/template
- [ ] Home, About, Contact pages
- [ ] WhatsApp floating icon + footer credit (site-wide)
- [ ] All 10 product category pages with specs + Get Quote CTA
- [ ] Media Library with mandatory alt text
- [ ] Get Quote lead form + admin Leads flat list with export/import
- [ ] Testimonials section (real reviews) + admin CRUD
- [ ] Blog + Events/News CMS (admin CRUD + public pages)
- [ ] SEO > Scripts injection field + per-page meta

### Add After Validation (v1.x)

Features to add once core site/admin is functional and content is live.

- [ ] SMTP email lead notifications (per SCOPE-DECISIONS.md — built last)
- [ ] n8n webhook lead notifications (optional, same phase as SMTP)

### Future Consideration (v2+)

Features to defer until the core site has launched and the client has supplied real gated content.

- [ ] Guides / lead-magnet PDF library (sample structure exists in `.planning/content-samples/`)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|----------------------|----------|
| Foundation (monorepo, DB, admin auth) | HIGH | MEDIUM | P1 |
| Premium Industrial design system | HIGH | HIGH | P1 |
| Home/About/Contact pages | HIGH | MEDIUM | P1 |
| 10 product category pages | HIGH | HIGH | P1 |
| Media Library + alt text | MEDIUM | MEDIUM | P1 |
| Get Quote form + Admin Leads | HIGH | MEDIUM | P1 |
| WhatsApp floating icon | MEDIUM | LOW | P1 |
| Testimonials section | MEDIUM | LOW | P1 |
| Blog + Events/News CMS | MEDIUM | MEDIUM | P1 |
| SEO Scripts injection | LOW | LOW | P1 |
| SMTP/n8n lead notifications | MEDIUM | LOW | P2 |
| Guides/lead-magnet system | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible (still v1 scope, last phase)
- P3: Nice to have, future consideration (v2)

## Competitor Feature Analysis

| Feature | Old Site (rsgprofilesheets.com, WordPress) | IndiaMART listing (rsgprofilesheets.in) | Our Approach |
|---------|----------------------------------------------|------------------------------------------|--------------|
| Product catalog structure | 9 categories, "Accessories" catch-all | 8 categories, granular SKUs with per-kg pricing | 10 dedicated category pages (current site structure + SDS/Turbo Ventilator split out + new Accessories page), no public pricing |
| Testimonials | Stock-photo testimonials, generic banners | Aggregate star ratings only | Real Google review quotes + aggregate badges (Google/IndiaMART/Justdial) |
| Lead capture | Basic contact form | "Contact Supplier" / inquiry buttons | "Get Quote" CTA on Home + every product page, tracked by source |
| Visual design | Dated WordPress theme, stock icons | Marketplace template, dense SKU tables | Premium Industrial (gradients/glassmorphism), guided-scanning page templates |
| Content freshness | Static, no CMS | Marketplace-managed | Admin CMS for products, blog, events, testimonials, media |

## Sources

- `.planning/PROJECT.md` — confirmed v1 requirements and out-of-scope list
- `.planning/SCOPE-DECISIONS.md` — feature-level decisions (testimonials, leads structure, design direction)
- `.planning/research/BUSINESS-INFO.md` — review/rating sources for testimonials
- `.planning/research/ASSET-INVENTORY.md` — current site content/asset gaps informing feature scope

---
*Feature research for: B2B industrial catalog + admin CMS*
*Researched: 2026-06-14*

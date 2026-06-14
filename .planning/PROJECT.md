# RSG Profile Manufacturing — Website & Admin Panel

## What This Is

A new public marketing/catalog website (Next.js) plus a React/Vite admin panel for **RSG Profile Manufacturing Pvt. Ltd.**, a Kanpur-based manufacturer of steel roofing sheets, structural steel (MS Pipe/Plate/Channel/Angle), decking, purlins, polycarbonate sheets, and roofing accessories. It replaces their current dated site (rsgprofilesheets.com) with a "Premium Industrial" design — gradients, glassmorphism, large photography — aimed at B2B buyers (factory owners, contractors, retailers, builders) across Uttar Pradesh and beyond.

## Core Value

A visitor researching roofing/structural steel suppliers should immediately perceive RSG as a credible, established, premium manufacturer — and be guided, without friction, into submitting a "Get Quote" lead. Lead generation is the site's reason for existing.

## Requirements

### Validated

(None yet — greenfield)

### Active

- [ ] Public site: Home, About, 10 product category pages, Blog, Contact
- [ ] "Get Quote" lead capture form (primary conversion action, present across product pages)
- [ ] WhatsApp floating contact icon (site-wide, number configured by client post-launch)
- [ ] Testimonials/reviews section using real Google/IndiaMART review data
- [ ] Client/partner logo section on Home/About (sourced from current site + Google where needed)
- [ ] Footer credit: "Developed and managed by Buildera Technologies LLP" linking to buildera.co (do-follow)
- [ ] Admin panel: Media Library with mandatory alt text on every item
- [ ] Admin panel: Leads — flat list with source tracking + export/import (no pipeline stages)
- [ ] Admin panel: SEO > Scripts field for arbitrary `<script>` injection (for client to add GA/GTM post-launch)
- [ ] Admin panel: content management for Blog posts and Events/News
- [ ] Premium Industrial design system: gradients (navy→steel-blue→cyan), glassmorphism panels, Sora/Source Sans 3 fonts, 60/30/10 color rhythm, generous whitespace/gutters per SCOPE-DECISIONS.md

### Out of Scope

- Newsletter signup (anywhere) — explicitly excluded by client
- Standalone "Client Logos" page — folded into Home/About sections instead
- Case studies page — explicitly excluded by client
- Built-in analytics dashboard — client pastes GA/GTM via admin post-launch instead
- Public pricing (per-kg or otherwise) — "Get Quote" only, keeps premium B2B feel vs. commodity-marketplace pricing seen on IndiaMART
- Lead pipeline/funnel stages, Meetings — leads stay a flat list
- Guides / gated lead-magnet PDFs — deferred to v2 (no real content exists yet; adds CMS complexity not justified for launch)
- SMTP email / n8n webhook lead notifications — build LAST, after core site/admin works (still v1, but lowest priority within it)

## Context

- **Current site**: rsgprofilesheets.com — WordPress/theme-based, dated design, real product photos of varying quality, stock "Our Process" icons and stock testimonial photos that need replacing.
- **Design reference**: aromamonk.com — gradient/glassmorphism hero with form-over-image pattern, used as the visual benchmark.
- **Target audience**: B2B buyers, likely an older demographic — readable type sizes (16-18px body), clear visual hierarchy, F/Z-pattern scanning, one obvious CTA per section.
- **Asset strategy**: client will NOT supply new images. Design must reuse real product/company photos scraped from the current site (see `research/ASSET-INVENTORY.md`), supplement with stock/illustration where assets are stock-template or missing (e.g. factory floor photos for hero backgrounds), and source missing client-logo images via Google search.
- **Business/contact data**: sourced via IndiaMART (rsgprofilesheets.in) and Google Business listing — see `research/BUSINESS-INFO.md`. IndiaMART is reference-only for business details (address, phone, ratings) and must NOT influence the product catalog structure, which follows the current website.
- **Content samples**: realistic sample Blog post, Guide, and Event entries exist in `.planning/content-samples/` to demonstrate CMS structure (Guides itself is deferred to v2, but the sample documents the intended shape if revisited).
- **Full scope decision log**: `.planning/SCOPE-DECISIONS.md` — authoritative record of every confirmed decision (design system, UX principles, product catalog structure, contact/footer handling, etc.). Treat as binding context for requirements and roadmap.

## Constraints

- **Tech stack**: Monorepo, single deploy, with separate top-level folders:
  - `/frontend` — Next.js (App Router, SSG/ISR) public site
  - `/backend` — Node.js (Express/Fastify) API serving both the public site's dynamic content and the admin panel — client specifically requires Node.js for performance
  - `/admin` — React + Vite SPA, authenticated against the backend API
  - **Database**: MySQL (client-specified)
- **Assets**: No new photography/design assets from client — must source/reuse existing real photos + stock fallbacks.
- **Contact info**: WhatsApp number and final business email are NOT to be hardcoded — built as configurable fields the client fills in after launch. Use `shivam.gupta09@gmail.com` as a placeholder email until then.
- **Pricing**: No public pricing anywhere — quote-based only.
- **Product catalog**: exactly 10 product category pages (current 9 + Self Drilling Screws and Turbo Air Ventilator split into their own pages + new "Accessories" page) — see SCOPE-DECISIONS.md "Product Catalog Structure".

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| "Premium Industrial" visual direction (gradients, glassmorphism, photography) over flat/minimal | Client's target audience (Indian B2B manufacturing buyers) expects visual richness; muted/minimal signals "small/unfinished" | — Pending |
| No public pricing, Get Quote only | Keeps premium manufacturer positioning vs. commodity marketplace feel of IndiaMART listings | — Pending |
| 10 product pages incl. dedicated SDS & Turbo Air Ventilator pages + new Accessories page | Matches old site's content depth while giving every distinct product line its own page | — Pending |
| Real Google/IndiaMART reviews replace stock-photo testimonials | Stock testimonial photos on old site aren't real customers; real 4.7★ Google reviews build genuine credibility | — Pending |
| Guides/lead-magnet system deferred to v2 | No real gated content exists yet; avoids building unused CMS complexity for launch | — Pending |
| WhatsApp number & business email configured by client post-launch, not hardcoded | Client wants control over which number/email goes live, may change before launch | — Pending |
| Footer credit to Buildera Technologies LLP (do-follow link) | Agency attribution requirement | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-14 after initialization*

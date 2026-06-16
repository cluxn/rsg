# Phase 6: SEO & Admin Configuration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 6-SEO & Admin Configuration
**Areas discussed:** Script injection format, SEO admin UI placement, Per-page meta storage, Sitemap scope

---

## Script Injection Format

| Option | Description | Selected |
|--------|-------------|----------|
| One textarea — head only | Single field for everything — GA, GTM, etc. all go in `<head>`. Simpler admin UX, covers 99% of cases. | ✓ |
| Two textareas — head + body end | Separate fields for `<head>` scripts (analytics) and end-of-`<body>` scripts (live chat, etc.). More flexible but more UI to explain. | |

**User's choice:** One textarea — head only
**Notes:** User deferred to senior engineer recommendation. Full `<script>` tag paste (not inner JS only) — senior call made inline.

---

## SEO Admin UI Placement

| Option | Description | Selected |
|--------|-------------|----------|
| One 'SEO' page with two sections | Top section: 'Head Scripts' textarea. Bottom section: table of pages with editable Title / Description per row. | ✓ |
| Two sub-pages: 'SEO > Scripts' and 'SEO > Pages' | Separate routes for scripts and per-page meta. | |

**User's choice:** One SEO page with two sections
**Notes:** "do as senior" — new sidebar entry (not a Settings tab), single page with two sections.

---

## Per-Page Meta Storage

| Option | Description | Selected |
|--------|-------------|----------|
| Static pages only — Home, About, Contact, Blog, Events, Products | 6 rows, fixed list. Dynamic pages already use content title/description as meta. | ✓ |
| Static + category overrides for products | 6 static + 10 product rows. Useful for SEO-optimised product page titles beyond the product name. | |

**User's choice:** Static pages only (6 rows)
**Notes:** Settings table with prefixed keys (`meta_title_/`, `meta_desc_/about`, etc.) — no schema change. Senior call made inline.

---

## Sitemap Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Static + dynamic | Static routes + all product slugs + all published blog post slugs. Next.js sitemap.ts, fetches from backend, always in sync. | ✓ |
| Static routes only | Fixed list of 6 pages. Simple but new content won't appear until a developer updates the file. | |

**User's choice:** Static + dynamic
**Notes:** Implemented as `frontend/app/sitemap.ts` — Next.js App Router built-in convention.

---

## Claude's Discretion

All areas had senior-engineer recommendations accepted via "do as senior" instruction. Specific discretionary calls:
- Full `<script>` tag format (vs. inner JS only)
- `dangerouslySetInnerHTML` injection approach (acceptable given auth gate)
- Settings table prefixed keys (vs. new `page_meta` table) — no migration needed
- New "SEO" sidebar section (vs. Settings tab)

## Deferred Ideas

- Per-product SEO meta overrides (products/[slug] edit form)
- Open Graph image fields per page
- robots.txt management via admin
- Structured data (JSON-LD) per page

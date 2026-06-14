# Phase 3: Product Catalog & Media Library - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-14
**Phase:** 03-product-catalog-media-library
**Areas discussed:** Product page layout, Spec data model, Media ↔ Product linking, Low-res photo strategy

---

## Product Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Single scroll (no tabs) | Hero → description → specs table → CTA | ✓ (as part of final hybrid) |
| Tabbed (Overview / Specs / Applications) | Tabs split content sections | |
| Two-column (image left, details right) | E-commerce style above the fold | ✓ (combined with hero above) |

**User's choice:** "Do as per modern design and as per target user and think like senior"
**Notes:** Claude made the senior call — two-column above the fold (product photo constrained left, content right) with a full-width hero banner at top, full-width specs table below the fold, no tabs (thin copy would make tabs feel empty), sticky Get Quote CTA. Chosen for B2B audience scanability, low-res photo handling, and F/Z pattern from SCOPE-DECISIONS.md.

---

## Spec Data Model

| Option | Description | Selected |
|--------|-------------|----------|
| Structured key-value rows | Admin builds specs row-by-row, stored as JSON array | ✓ |
| Rich text / WYSIWYG | Single textarea with formatting | |
| Free-form plain text | Just a textarea, no structure | |

**User's choice:** Deferred to Claude's judgment
**Notes:** Hybrid selected — `description` plain text + `specs` JSON array of `{label, value}`. Admin gets a simple add/remove row UI in shadcn. Pre-seeded with current-site content per ASSET-INVENTORY.md.

---

## Media ↔ Product Linking

| Option | Description | Selected |
|--------|-------------|----------|
| Direct upload in product editor | Images saved to product, not global library | |
| Pick from global Media Library | Product editor opens a modal to select from library | ✓ |
| Both (upload + pick) | Dual workflow in product editor | |

**User's choice:** Deferred to Claude's judgment
**Notes:** Global Media Library only — admin must upload to library first (alt text enforced), then pick. Clean architecture, no duplicate storage, alt text requirement enforced at the library layer before any image can be used anywhere.

---

## Low-Res Photo Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Display product photos at full width | Upscale 300×300 WhatsApp shots to hero | |
| Stock photos for hero, product photos in card | Hero = curated stock; product photo in constrained card | ✓ |
| No hero image | Skip hero on product pages | |

**User's choice:** Deferred to Claude's judgment
**Notes:** Stock steel/roofing/industrial photography (Unsplash/Pexels) for full-width hero banners. Real product photos in the constrained two-column card (max ~500px). Only Polycarbonate Sheet and MS Pipe have full-res photos usable as hero. All heroes get the gradient overlay from the Premium Industrial design system to unify varied sources.

---

## Claude's Discretion

- Exact stock photo selection per product category (researcher/implementer picks from Unsplash/Pexels)
- URL slug pattern for product pages
- Exact shadcn/ui component selection for spec-row builder and media picker modal
- Whether drag-to-reorder for spec rows/image order is included (only if trivially easy; otherwise up/down buttons)

## Deferred Ideas

- Full carousel/lightbox for product image gallery — Phase 3 uses simple thumbnail row
- "Create new product category" admin feature — 10 categories fixed for v1
- Media Library filtering (by used/unused, by product)
- Rich text / Markdown for product descriptions — upgrade later if client requests formatted copy

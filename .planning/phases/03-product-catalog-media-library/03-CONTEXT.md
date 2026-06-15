# Phase 3: Product Catalog & Media Library - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning

<domain>
## Phase Boundary

All 10 product category pages live on the public site with real descriptions, specs, and images sourced per `.planning/research/ASSET-INVENTORY.md` — each built on the Phase 1 design system, manageable via admin CRUD, and linked to a global Media Library that enforces mandatory alt text on every uploaded asset.

This phase covers public-facing product pages, the admin product editor (CRUD), and the admin Media Library. Lead capture forms (Get Quote) appear on product pages as CTAs but the form submission logic is wired in Phase 4 — in this phase the CTA button exists and renders correctly but form submission is a stub.

</domain>

<decisions>
## Implementation Decisions

### Product Page Layout
- **D-01:** Two-column layout above the fold on desktop: product image/gallery on the left (~50% width, constrained to ~500px max so low-res WhatsApp photos aren't upscaled), title + short description + key specs highlights + "Get Quote" CTA on the right. Full-width specs table rendered below the fold. Mobile collapses to single column (image → title → description → specs → CTA).
- **D-02:** No tabs. Products have thin copy; tabs would render half-empty on most pages. Single continuous scroll with clear section breaks (divider lines, section headings) is the right call for this content depth.
- **D-03:** Each product page has a full-width hero banner at the very top (page-level visual, separate from the product image in the two-column section). Hero uses the best available asset per product: Polycarbonate Sheet and MS Pipe have full-res photos → use them as hero. All other products use a curated stock steel/roofing/industrial photo as hero background with the gradient overlay from the Premium Industrial design system. The product's own WhatsApp photo appears in the constrained two-column card, not stretched to full width.
- **D-04:** "Get Quote" CTA is always visible on the right column (sticky on desktop scroll if content is long enough to push it off screen). Accent orange button, consistent with site-wide CTA styling from SCOPE-DECISIONS.md.
- **D-05:** Specs table below the fold: two-column (Spec / Value), full-width, styled with the design system (alternating row tint, Sora header, Source Sans 3 body). Empty spec rows not rendered — if a product has no specs yet, the table section is hidden rather than showing an empty table.

### Spec Data Model
- **D-06:** Hybrid storage — each product record has two content fields:
  - `description` (TEXT): plain text paragraph(s) about the product (what it is, uses, materials). No WYSIWYG/rich text — keeps it simple and avoids rendering complexity.
  - `specs` (JSON): array of `{ label: string, value: string }` objects. Rendered as the styled specs table on the public page.
- **D-07:** Admin product editor provides a "Spec Rows" section with a simple add/remove row UI (shadcn Table + text inputs for label and value, "Add Row" button, drag-to-reorder optional but not required for Phase 3). No WYSIWYG editor — just text fields. This keeps admin UI buildable and the data clean.
- **D-08:** Seed data: pre-populate all 10 products with the spec rows and description text extracted from the current site (per ASSET-INVENTORY.md). Admin can edit from there. Do not launch with empty product pages.

### Media Library ↔ Product Linking
- **D-09:** Global Media Library is the single source of truth for all uploaded images. Admin uploads to the library first (alt text is enforced at upload — cannot save without it), then images are referenced by products.
- **D-10:** Product editor has a "Product Images" section with a "Select from Media Library" button that opens a modal grid of all library items. Admin picks one or more images. No direct file upload inside the product editor — upload happens in the Media Library, then pick. This enforces the alt-text requirement before an image can appear anywhere.
- **D-11:** A product can have multiple images. First image in the list is the primary (shown in the two-column card). Additional images shown as thumbnails below the primary image (simple thumbnail row, not a full carousel — keep Phase 3 scope tight). Image order is editable (drag or up/down buttons).
- **D-12:** Media Library admin view: grid of cards (thumbnail + filename + alt text preview). Actions: upload (with required alt text field), edit alt text, delete (with a warning if the image is used by any product). Filter by unlinked/used is nice-to-have but not required for Phase 3.

### Low-Res Photo Strategy
- **D-13:** Product WhatsApp photos (300×300) are displayed in the constrained product card (two-column left column, max ~500px wide) — not stretched to full-width hero. At constrained size they are acceptable quality.
- **D-14:** Full-width hero banners on product pages use stock steel/roofing/industrial photography where a real high-res product photo is unavailable. Source from Unsplash/Pexels (free license) during build. Polycarbonate Sheet and MS Pipe are the only two with real full-res photos suitable for hero use.
- **D-15:** The hero on all product pages uses the same gradient overlay pattern from the Phase 1 design system (navy→steel-blue→cyan diagonal, semi-transparent) so the stock photo variation doesn't make pages feel inconsistent — the overlay unifies them.

### Admin Catalog UI
- **D-16 (REVISED 2026-06-15):** Admin Catalog section (left sidebar) shows all **19 products** as a fixed list (not paginated, not user-creatable). Admin clicks a product to edit it. No "create new product category" in Phase 3 — the 19 are seeded and locked. (Originally 10; expanded per `SCOPE-DECISIONS.md` "Product Catalog Structure" revision to match the old site's real mega-menu — added Galvanized Plain Sheets + 8 Colour Coated Roofing Sheet brand variant pages, see `004_catalog_expansion.sql`.)
- **D-17:** Product editor page layout: product name (read-only at top), then Description field, then Spec Rows section, then Product Images section. Save button at top-right (sticky) and at bottom. No autosave — explicit Save.
- **D-18:** On successful save, trigger ISR revalidation for that product's public page so the change is live within seconds (uses the revalidation endpoint built in Phase 1).

### Claude's Discretion
- Exact stock photo selection for hero backgrounds (researcher/implementer picks from Unsplash/Pexels per product category).
- Exact shadcn/ui component selection for the spec-row builder and media picker modal.
- URL slug pattern for product pages (e.g. `/products/colour-coated-roofing-sheet` or `/catalog/[slug]`).
- Whether to add drag-to-reorder to spec rows or image order in Phase 3 (implement only if trivially easy with chosen component; otherwise up/down buttons suffice).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Content & Asset Sources
- `.planning/research/ASSET-INVENTORY.md` — Per-product image quality assessment, which products have usable real photos vs. stock fallbacks needed, copy quality notes. MUST read before seeding or sourcing images.
- `.planning/SCOPE-DECISIONS.md` — "Product Catalog Structure" section (the 10 categories, locked; no per-kg pricing; no IndiaMART structure) and "Admin Panel" section (Media Library alt text requirement, admin navigation order). Also "Design Direction" and "UX Principle" sections govern product page design.

### Design System & Stack (from Phase 1)
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` — D-06 (shadcn/ui for admin, custom Tailwind for public), D-04 (flat tables for data screens, glassmorphism reserved for dashboards/login), ISR revalidation endpoint exists and must be called on product save.
- `.planning/research/STACK.md` — Tech stack (Next.js 15, Express, mysql2, Tailwind). Add: JSON column for `specs` field in MySQL.
- `.planning/research/ARCHITECTURE.md` — Layered Express API pattern, ISR revalidation pattern to reuse for product page revalidation on save.

### Requirements
- `.planning/REQUIREMENTS.md` — CATALOG-01, CATALOG-02, CATALOG-03, MEDIA-01, MEDIA-02 requirement definitions for Phase 3.
- `.planning/PROJECT.md` — Monorepo structure (`/frontend`, `/backend`, `/admin`), MySQL constraint, no public pricing anywhere.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phase 1)
- Premium Industrial design system components (gradient hero, glassmorphism panels, Sora/Source Sans 3, Tailwind config) — product page hero and card styling reuses these directly.
- ISR revalidation endpoint on `/backend` — call this after admin saves a product to update the public page within seconds (D-18).
- shadcn/ui installed in `/admin` with RSG theme — Table, Dialog/Modal, Button, Input components available for the spec row builder and media picker.

### Established Patterns
- Two-column page pattern (image left / content right) is standard in the Premium Industrial system — consistent with how home page hero form-over-image works conceptually.
- Settings key-value table (from Phase 1) establishes the pattern of JSON/structured data in MySQL columns — `specs` JSON array follows the same approach.

### Integration Points
- `/backend` products API → `/admin` product editor CRUD → triggers ISR revalidation on `/frontend`
- `/backend` media API → `/admin` Media Library → media picker modal in product editor
- `/frontend` product pages consume `/backend` product data (description, specs JSON, linked media alt texts + URLs)
- Phase 4 will wire the "Get Quote" CTA form submission — in Phase 3, the CTA button renders and links to the form anchor but the form itself is a stub (or pre-built visually but not functional)

</code_context>

<specifics>
## Specific Ideas

- Product pages should feel like "manufacturer product sheets" — specs table is prominent and professional, not buried. B2B buyers come to verify gauge, material grade, dimensions; specs are the real content.
- Hero gradient overlay on all product pages unifies the varied stock photo sources — the steel-blue/navy overlay is the constant, the background image varies per product. This is the right call for a consistent Premium Industrial feel across 10 pages with uneven photography.
- "No tab layout" was deliberately chosen over a common pattern — thin copy would make tabs feel broken. Progressive disclosure via scroll (overview above fold, specs below) serves the F/Z pattern from SCOPE-DECISIONS.md without requiring a user to discover content is hidden behind a tab.

</specifics>

<deferred>
## Deferred Ideas

- Full carousel/lightbox for product image gallery — Phase 3 uses a simple thumbnail row. A proper swipeable carousel can be added in a later polish pass if needed.
- "Create new product category" admin feature — the 10 categories are fixed for v1. Dynamic category creation is a v2 consideration.
- Media Library filtering (by used/unused, by product) — useful UX improvement but not required for Phase 3 functional scope.
- Rich text / Markdown for product descriptions — plain text is sufficient for launch; if client wants formatted copy later, upgrading the description field is a contained change.

None — discussion stayed within phase scope. No todos matched Phase 3 scope.

</deferred>

---

*Phase: 3-product-catalog-media-library*
*Context gathered: 2026-06-14*

# Phase 3: Product Catalog & Media Library — UI Design Contract

**Phase:** 3
**Generated:** 2026-06-14
**Status:** Ready for planning
**Source:** Inline synthesis from CONTEXT.md (D-01–D-18), SCOPE-DECISIONS.md, Phase 1 design system

---

## Design System Baseline (from Phase 1)

| Token | Value |
|-------|-------|
| Primary gradient | `gradient-premium` → navy → steel-blue → soft cyan, diagonal |
| Glass panel | `glass-panel` class → frosted/translucent backdrop-blur |
| Accent / CTA color | `#E8590C` (burnt orange) |
| Font — headings | Sora |
| Font — body / specs | Source Sans 3 |
| Body text min | 16–18px, line-height 1.6–1.8 |
| Spec/label text min | 15–16px |
| Max-width container | ~1280–1320px centered |
| Desktop side padding | 64–80px |
| Mobile side padding | 24px |
| Section spacing (desktop) | 96–128px between major sections |
| Section spacing (mobile) | 48–64px |
| Corner radius (cards) | 10–12px |
| Dominant surface | Off-white (`bg-off-white`) |
| CTA class | `CTAButton` — orange accent, consistent site-wide |

---

## 1. Public Product Page (`/products/[slug]`)

### 1.1 Full-Width Hero Banner (top of page)

| Property | Spec |
|----------|------|
| Height | `min-h-[480px]` (same as GradientHero default); `min-h-[560px]` on desktop |
| Background | `next/image` with `fill` + `object-cover`; per-product stock/real photo |
| Overlay | `gradient-premium` at ~60% opacity over photo (`absolute inset-0`) |
| Hero content | Product name (Sora, white, ~48px desktop / 32px mobile), short tagline or category label |
| Priority load | `priority` prop on hero image |

**Photo sources by product:**
- Polycarbonate Sheet, MS Pipe: real product photo from ASSET-INVENTORY.md
- All others: Unsplash commercial-use stock photo (steel/roofing/industrial per category)

### 1.2 Two-Column Section (below hero, above fold)

| Property | Spec |
|----------|------|
| Desktop layout | `grid grid-cols-2 gap-12 max-w-[1280px] mx-auto px-16 py-16` |
| Mobile layout | Single column (`grid-cols-1 gap-8 px-6 py-10`) — image first, then content |
| Left col: primary image | `max-w-[500px]` constrained, `rounded-xl`, `shadow-md`; `next/image` with explicit width/height |
| Left col: additional images | Thumbnail row below primary: `flex gap-3 mt-4`; thumbnails ~80×80px, clickable to swap primary display |
| Right col: title | Sora, 32px desktop / 24px mobile, `text-navy` |
| Right col: description | Source Sans 3, 16–17px, `text-navy/80`, max 3–4 lines visible; full description in the right column |
| Right col: key spec highlights | 3–4 most important specs as badges or `<dl>` pairs above the fold |
| Right col: CTA button | `<CTAButton>` — "Get Quote", accent orange, full-width on mobile, fixed-width on desktop |
| CTA sticky | `sticky top-24` on desktop when content is tall enough to push CTA off-screen |

### 1.3 Specs Table (below fold, full-width)

| Property | Spec |
|----------|------|
| Visibility | Hidden if `product.specs` is empty or null — no empty table rendered (D-05) |
| Container | `max-w-[1280px] mx-auto px-16 pb-24` |
| Table style | Full-width, two columns: **Spec** (left, `font-semibold text-navy`, Sora) / **Value** (right, Source Sans 3) |
| Row tint | Alternating: odd rows `bg-white`, even rows `bg-steel/5` |
| Row padding | `py-3 px-4` per cell |
| Min font | 15px for spec labels, 15px for values |
| Section heading | "Specifications" (Sora, 24px, `text-navy`, with bottom border) |

### 1.4 Get Quote CTA Section (below specs, above footer)

| Property | Spec |
|----------|------|
| Section | `bg-navy` full-width band, `py-16` |
| Content | Short prompt ("Ready to get a quote?") + large orange `CTAButton` ("Get Quote") + WhatsApp link |
| Phase 3 stub | `id="get-quote-section"` anchor exists; form shell renders visually but submit is a no-op (Phase 4 wires logic) |

### 1.5 Mobile Rules
- Hero collapses to `min-h-[280px]`
- Single column: hero → primary image (full width, `max-h-[280px] object-cover`) → title → description → CTA → specs → footer CTA band
- Thumbnail row hidden on mobile (single primary image only)
- Sticky CTA not applied on mobile (fixed at bottom instead, or inline)

---

## 2. Admin Media Library (`/media`)

### 2.1 Page Layout

| Property | Spec |
|----------|------|
| Header | "Media Library" (`text-2xl font-heading text-navy`) + "Upload New" button (right side, orange `CTAButton` style) |
| Grid | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6` |
| Card | `rounded-xl border border-navy/10 bg-white overflow-hidden shadow-sm` |
| Card thumbnail | `aspect-square w-full object-cover bg-steel/10` |
| Card footer | `p-3` — filename (12px, truncated 1 line), alt text (11px, `text-navy/60`, truncated 2 lines) |
| Card actions | Two icon buttons: pencil (Edit Alt Text) + trash (Delete), shown on hover or always visible below footer |

### 2.2 Upload Modal (shadcn Dialog)

| Property | Spec |
|----------|------|
| Trigger | "Upload New" button in page header |
| Title | "Upload Media" |
| File input | `<input type="file" accept="image/*">` — styled with shadcn label styling |
| Alt text field | `<Textarea>` (shadcn), required, placeholder "Describe the image for accessibility (required)", min 3 chars |
| Submit button | Disabled until both file selected AND alt text non-empty; text "Upload Image" (orange, full-width) |
| Validation | Client-side: show inline error "Alt text is required" if attempt to submit empty; server also rejects (400) |
| On success | Modal closes, query invalidated, new card appears in grid |

### 2.3 Edit Alt Text Modal

| Property | Spec |
|----------|------|
| Trigger | Pencil icon on card |
| Title | "Edit Alt Text" |
| Content | Pre-filled `<Textarea>` with current alt_text |
| Save button | "Save" (primary orange), Cancel |

### 2.4 Delete Flow

| Property | Spec |
|----------|------|
| Trigger | Trash icon on card |
| If not used | Confirm dialog: "Delete this image? This cannot be undone." |
| If used by products | Warning dialog: "This image is used by: [product names]. Remove it from those products first before deleting." Delete button disabled until unlinked. |

---

## 3. Admin Product Catalog (`/catalog`)

### 3.1 Catalog List Page

| Property | Spec |
|----------|------|
| Header | "Product Catalog" |
| Layout | Flat list (not a data table) — `div.space-y-2 p-6` |
| Each row | `flex justify-between items-center p-4 rounded-xl border border-navy/10 bg-white` |
| Row content | Product name (Sora, 16px, `text-navy`) + "Edit →" link button (steel-blue text, no background) |
| No create/delete | Fixed 10 products — no create or delete UI present |

### 3.2 Product Editor Page (`/catalog/:slug`)

| Property | Spec |
|----------|------|
| Back link | "← Back to Catalog" at top-left |
| Product name | `text-2xl font-heading text-navy` — read-only, no input |
| Save button | Sticky `<button>` at top-right (`sticky top-4 z-10`), accent orange, "Save Changes" text; also repeated at bottom of form |
| Save state | Button shows "Saving…" during request; "Saved ✓" for 2s on success; "Error" on failure |

**Description section:**
| Property | Spec |
|----------|------|
| Label | "Description" (Sora, 14px uppercase tracking, `text-navy/60`) |
| Input | `<Textarea>` — full-width, `min-h-[160px]`, Source Sans 3 16px, `border border-navy/20 rounded-lg p-3` |

**Spec Rows section:**
| Property | Spec |
|----------|------|
| Section heading | "Specifications" |
| Table | shadcn `<Table>` — columns: Spec Name \| Value \| Remove |
| Each row | Two `<Input>` fields (spec label, spec value) + `<Button variant="ghost">` trash icon |
| Add Row | "Add Row +" button (outline, below table) — appends `{ label: '', value: '' }` |
| Reorder | Up/Down icon buttons per row (if DnD not trivially addable); move row in local state array |
| Empty state | "No specifications added. Click Add Row to start." |

**Product Images section:**
| Property | Spec |
|----------|------|
| Section heading | "Product Images" |
| Current images | Ordered thumbnail strip: `flex gap-3 flex-wrap`, each `64×64px` rounded img |
| First image badge | "Primary" badge (steel-blue pill) on first thumbnail |
| Reorder | Up/Down arrows per image; "Remove" (X) per image |
| Add images button | "Select from Media Library" — opens MediaPickerModal |

**Media Picker Modal:**
| Property | Spec |
|----------|------|
| Trigger | "Select from Media Library" button |
| Layout | shadcn Dialog, large (`max-w-[800px]`) |
| Content | Grid of all media items (`grid-cols-3 sm:grid-cols-4 gap-3`), each with thumbnail + alt text |
| Selection | Checkbox overlay on each thumbnail; multi-select allowed |
| Footer | "Add Selected (N)" button (orange, disabled until ≥1 selected) + Cancel |
| Already linked | Media items already linked to this product shown with checkmark; cannot re-add |

---

## 4. Accessibility Requirements

- All `<img>` for product photos: `alt` text from `media.alt_text` (enforced at upload)
- Hero `next/image`: `alt` = product name
- Spec table: `<th>` with `scope="col"` for Spec/Value headers
- CTA button: visible focus ring (`focus-visible:ring-2 focus-visible:ring-orange`)
- Upload modal: focus trap when open, ESC closes, first field focused on open
- Contrast: `text-navy` on `bg-off-white` — verified AA; white text on `gradient-premium` — verified AA for bold headlines

---

## 5. Interaction & Animation

- Card hover in MediaLibrary: `hover:shadow-md transition-shadow duration-150` — subtle only
- Thumbnail swap on click (product page additional images): instant, no animation
- Modal open/close: shadcn Dialog default transition (fade + scale)
- Save button loading: spinner icon + "Saving…" text while pending
- No page-level loading skeletons beyond what TanStack Query's `isLoading` state shows (simple spinner centered in card grid)

---

*Phase: 3-product-catalog-media-library*
*UI contract generated: 2026-06-14*

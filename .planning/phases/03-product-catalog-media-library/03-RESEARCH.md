# Phase 3: Product Catalog & Media Library — Research

**Phase:** 3
**Researched:** 2026-06-14
**Confidence:** HIGH

---

## ## RESEARCH COMPLETE

---

## What Exists From Phase 1

### Database (already migrated)
- `products` table: `id, slug, name, description TEXT, specs JSON, display_order, created_at, updated_at`
- `media` table: `id, filename, original_name, alt_text VARCHAR(500) NOT NULL, mime_type, size, url, uploaded_at`
- All 10 product rows seeded with slug + name + display_order (but empty description, null specs, no linked images)
- **Missing:** `product_media` junction table to link products ↔ media items

### Backend
- `backend/src/routes/revalidate.ts` — POST `/api/revalidate` already works (JWT or secret-protected); calls `FRONTEND_URL/api/revalidate` with `{ secret, path, tag }`
- `backend/src/routes/settings.ts`, `auth.ts` established the layered pattern: route → controller inline (small routes) → `pool.query()` with prepared statements
- **Missing:** products route, media route

### Frontend
- `frontend/app/api/revalidate/route.ts` — accepts `{ secret, path, tag }`, calls `revalidatePath(path, 'page')` or `revalidateTag(tag, 'default')`
- Design system components in `frontend/components/ui/`: `GradientHero`, `GlassCard`, `CTAButton`, `SectionContainer`
- CSS classes from Phase 1: `gradient-premium`, `glass-panel`, font classes for Sora/Source Sans 3
- **Missing:** `/products/[slug]` route, product API fetcher

### Admin
- Sidebar already has `Catalog` → `/catalog` and `Media Library` → `/media` routes (both render 404 currently)
- shadcn/ui installed: `button.tsx`, `input.tsx`, `label.tsx`, `GlassStatCard.tsx`
- Auth pattern established: `ProtectedRoute.tsx`, JWT stored in memory, axios interceptor via `admin/src/lib/api.ts`
- **Missing:** Catalog page, ProductEditor page, MediaLibrary page

---

## What Phase 3 Must Build

### 1. `product_media` Junction Table (new migration)
```sql
CREATE TABLE IF NOT EXISTS product_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  media_id INT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_product_media (product_id, media_id)
);
```
`ON DELETE RESTRICT` on media prevents deletion of images used by products (surfaced as an error/warning in the admin — D-12).

### 2. Product Seed Data
Populate existing 10 product rows with `description` and `specs` JSON from ASSET-INVENTORY.md:

| Product | Slug | Description Source | Specs Available |
|---------|------|--------------------|-----------------|
| Colour Coated Roofing Sheet | colour-coated-roofing-sheet | Thin, materials-list only (GI, Galvalume, PPGI, PPGL) | Minimal |
| MS Plate/Channel/Angle | ms-plate-channel-angle | Good — size/thickness per sub-type | Yes — Plate/Channel/Angle sizes |
| MS Pipe | ms-pipe | Strong — Seamless vs Semi-Seamless, properties, manufacturing | Yes — properties table |
| Decking Sheet | decking-sheet | Good — uses + key features | Yes |
| Purlins | purlins | Thin — one paragraph | Partial (C/Z sizes) |
| Polycarbonate Sheet | polycarbonate-sheet | Strong — types, uses, features | Yes |
| Crimping Sheet | crimping-sheet | Short but adequate | Minimal |
| Self Drilling Screws | self-drilling-screws | Good short copy | Minimal |
| Turbo Air Ventilator | turbo-air-ventilator | Good short copy | Minimal |
| Accessories | accessories | Corner accessories, ridge cover, flashing, gutter | Minimal |

Implement as `002_product_seed.sql` migration or in `seed.ts` with `UPDATE ... WHERE slug = ?` for each product.

### 3. Backend Routes Needed

**Products (add to backend):**
- `GET /api/products` — list all products (public), include `display_order`; for public site use only slug+name in list, full details on single
- `GET /api/products/:slug` — get single product with description, specs, and linked media (JOIN product_media → media)
- `PUT /api/products/:slug` — update description, specs, images (requires JWT); after save, call revalidate endpoint for `/products/{slug}`
- `GET /api/products/:slug/media` — list media linked to product (for admin editor)
- `POST /api/products/:slug/media` — link media to product (body: `{ media_id, display_order }`)
- `DELETE /api/products/:slug/media/:mediaId` — unlink media from product
- `PATCH /api/products/:slug/media/reorder` — update display_order for all linked images

**Media (add to backend):**
- `POST /api/media/upload` — Multer multipart, requires `alt_text` in body, requires JWT; reject if `alt_text` is empty/missing (return 400); call `sharp` to generate WebP thumbnail + original WebP version; store in `backend/uploads/`; INSERT into `media` table; return media record
- `GET /api/media` — list all media (requires JWT); returns id, filename, alt_text, url, thumbnail_url
- `PUT /api/media/:id` — update alt_text only (requires JWT)
- `DELETE /api/media/:id` — delete media (requires JWT); check `product_media` first — if linked, return 409 with `{ linkedProducts: [...] }` so admin can show warning
- `GET /api/media/:id/usage` — check which products use this media item (for delete warning)

**Multer + sharp pattern:**
```typescript
// backend/src/middleware/upload.ts
import multer from 'multer';
import sharp from 'sharp';
const storage = multer.memoryStorage(); // process in memory, sharp writes to disk
export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// In media controller: after multer processes the file
const webpBuffer = await sharp(req.file.buffer)
  .webp({ quality: 85 })
  .toFile(`uploads/${filename}.webp`);
const thumbBuffer = await sharp(req.file.buffer)
  .resize(400, 400, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile(`uploads/${filename}_thumb.webp`);
```

**URL for uploaded media:** Express must serve `backend/uploads/` as static: `app.use('/uploads', express.static(path.join(__dirname, '../uploads')))`. URLs stored in DB: `/uploads/filename.webp`.

### 4. Frontend Product Pages

**Route:** `frontend/app/(site)/products/[slug]/page.tsx`

```typescript
// SSG with ISR
export const revalidate = 3600; // fallback ISR window; on-demand revalidation handles immediate updates

export async function generateStaticParams() {
  // Fetch all product slugs from backend at build time
  const products = await fetch(`${BACKEND_URL}/api/products`).then(r => r.json());
  return products.map((p: { slug: string }) => ({ slug: p.slug }));
}
```

**Page structure:**
1. `<GradientHero>` — full-width, uses `next/image` with `priority` for background + gradient overlay  
2. Two-column section (desktop grid-cols-2, mobile single col): primary image (constrained) | title + description + key specs highlights + sticky CTA
3. Specs table (if product.specs exists and has rows): alternating-row-tint, full-width
4. Get Quote CTA stub (Phase 4 wires form; Phase 3 renders an orange button that scrolls to an anchor or links to `#get-quote`)

**Hero background strategy per product (ASSET-INVENTORY.md + D-14):**
- Polycarbonate Sheet: use real product photo (1024x768) as hero background  
- MS Pipe: use real product photo (decent WhatsApp full-size) as hero background
- All other 8: use Unsplash stock photo (steel/industrial/roofing) + gradient overlay. Source during implementation — see suggested searches below.

**Suggested Unsplash searches per product (implementer picks best fit):**
- Colour Coated Roofing Sheet: "corrugated metal roof" / "industrial roofing"
- MS Plate/Channel/Angle: "steel plate metal" / "structural steel factory"
- Decking Sheet: "steel decking construction" / "metal floor deck"
- Purlins: "steel purlins warehouse" / "industrial steel frame"
- Crimping Sheet: "metal roofing sheets" / "steel roofing factory"
- Self Drilling Screws: "metal screws hardware" / "self tapping screws industrial"
- Turbo Air Ventilator: "industrial ventilation" / "roof ventilator"
- Accessories: "roofing accessories" / "metal flashing construction"

**`next/image` for backgrounds:** use `fill` layout with `object-fit: cover` + inline overlay div with `gradient-premium` class (matching Phase 1 hero pattern).

### 5. Admin Media Library Page

**Route:** `/media` → `admin/src/pages/MediaLibrary.tsx`

**Layout:**
- Header: "Media Library" + "Upload New" button (opens modal)
- Grid: responsive card grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`), each card shows:
  - Thumbnail (`<img>` from `/uploads/..._thumb.webp`)
  - Alt text preview (truncated 2 lines)
  - Filename
  - Actions: Edit Alt Text, Delete
- Upload Modal (shadcn Dialog):
  - File input (accept="image/*")
  - Required alt text textarea (validate non-empty before submit)
  - Submit button: disabled until both file and alt_text provided
- Edit Alt Text Modal: pre-filled textarea, save via PUT
- Delete: show usage warning if image is linked to any product (`GET /api/media/:id/usage`)

**TanStack Query hooks:**
```typescript
useQuery({ queryKey: ['media'], queryFn: () => api.get('/media').then(r => r.data) })
useMutation({ mutationFn: (formData) => api.post('/media/upload', formData) })
useMutation({ mutationFn: ({ id, alt_text }) => api.put(`/media/${id}`, { alt_text }) })
useMutation({ mutationFn: (id) => api.delete(`/media/${id}`) })
```

### 6. Admin Product Catalog Editor

**Catalog list route:** `/catalog` → `admin/src/pages/Catalog.tsx`
- Read-only list of 10 products (fetched from `GET /api/products`)
- Each row: product name + "Edit" button → `/catalog/:slug`
- No create/delete (D-16)

**Product editor route:** `/catalog/:slug` → `admin/src/pages/ProductEditor.tsx`
- Fetch product on mount via `GET /api/products/:slug`
- **Description section:** `<textarea>` with Source Sans 3 font, full-width, ~8 rows
- **Spec Rows section:** shadcn Table with 2 columns (Label | Value), rows from `specs` JSON
  - Add Row button: appends `{ label: '', value: '' }` to the list
  - Remove Row button (trash icon) per row
  - Inputs are controlled components updating local state
  - Optional drag-to-reorder: skip unless `@dnd-kit/sortable` is trivially addable; use up/down buttons otherwise (D-07)
- **Product Images section:**
  - "Select from Media Library" button → opens media picker modal (grid of all library items, click to select, multi-select, confirm)
  - Display selected images as ordered thumbnail row
  - Up/down buttons for reorder; "Remove" per image
  - First image in list = primary (labeled)
- **Save button:** sticky at top-right (`sticky top-4 z-10`) + at bottom
  - On save: PUT `/api/products/:slug` with `{ description, specs, media_ids_ordered }`
  - Shows success toast + triggers ISR via the existing revalidate route
  - No autosave (D-17)

**Media Picker Modal (reusable component):**
```
admin/src/components/MediaPickerModal.tsx
- Props: open, onClose, onConfirm(selectedMediaIds[])
- Fetches all media from GET /api/media
- Grid of thumbnails, checkboxes, confirm button
```

---

## Technical Decisions

### Slug-to-URL Pattern
`/products/[slug]` using the slugs already seeded:
`colour-coated-roofing-sheet`, `ms-plate-channel-angle`, `ms-pipe`, `decking-sheet`, `purlins`, `polycarbonate-sheet`, `crimping-sheet`, `self-drilling-screws`, `turbo-air-ventilator`, `accessories`

### ISR Revalidation on Product Save
Backend PUT handler (after successful UPDATE):
```typescript
await fetch(`${process.env.FRONTEND_URL}/api/revalidate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: process.env.REVALIDATE_SECRET,
    path: `/products/${slug}`,
  }),
});
```
This matches the existing pattern in `backend/src/routes/revalidate.ts`.

### Get Quote CTA (Phase 3 stub)
The CTA button renders on every product page (`CTAButton` component from Phase 1), accent orange (#E8590C), labeled "Get Quote". In Phase 3 it scrolls to `#get-quote-section` which contains a visual placeholder (form shell without submit logic). Phase 4 wires the actual form submission. This satisfies CATALOG-02 (CTA visible) without Phase 4 scope bleeding in.

### Media Upload Size Constraint
Limit multipart uploads to 10MB (Multer limit). Sharp processes to WebP to keep stored sizes small. Two files per upload: original-size WebP (for full display) + 400×400 thumbnail WebP (for Media Library grid and product thumbnail).

### Alt Text Enforcement
`media.alt_text` column is `VARCHAR(500) NOT NULL` (enforced at DB level). Backend also validates `alt_text` is non-empty before INSERT (returns 400 if missing/empty). Admin UI disables submit until alt_text field has content. Triple-enforced.

### No Direct Upload in Product Editor
Product editor's "Select from Media Library" only picks from existing media — no direct upload in editor (D-10). Admin must go to Media Library to upload first. This guarantees alt text is captured before any image is used.

---

## Validation Architecture

### Functional Checks (post-build)
- `GET /api/products/polycarbonate-sheet` returns `{ description, specs: [...], media: [...] }` with at least one media item after seed
- `GET /api/products` returns 10 items
- `POST /api/media/upload` without `alt_text` returns 400
- `POST /api/media/upload` with valid file + alt_text returns 201 with media record
- `DELETE /api/media/:id` where id is linked to a product returns 409
- After admin PUT `/api/products/ms-pipe`, `GET /frontend/products/ms-pipe` (after revalidation) reflects updated content

### Visual Checks
- `/products/colour-coated-roofing-sheet` renders full-width hero, two-column layout, specs table, orange "Get Quote" CTA
- Mobile (375px): single column, image → title → description → specs → CTA
- Admin `/media`: grid of cards with thumbnails, upload modal requires alt text before submit
- Admin `/catalog/ms-pipe`: spec rows are editable, save triggers ISR, product page updates

---

## Risks & Pitfalls

| Risk | Mitigation |
|------|-----------|
| Low-res product photos (300×300) look bad stretched | `next/image` constrained to max-w-[500px] in two-column card (D-13); hero uses stock overlay |
| stock photos may not be free for commercial use | Use Unsplash license (free for commercial) or Pexels; document sources in alt text |
| `ON DELETE RESTRICT` on `product_media.media_id` causes confusing FK errors | Backend catches FK error and returns 409 with `{ linkedProducts }` payload; admin shows human-readable warning |
| Sharp native binaries on Windows dev vs Linux VPS | `sharp` has prebuilt binaries for both; install with `npm install sharp` on each platform; no special flags needed |
| Product page 404 on first deploy (before generateStaticParams runs) | `not-found.tsx` in products route handles this; ISR fallback (`dynamicParams = true`) also covers it |
| TanStack Query stale cache after upload/delete in MediaLibrary | `invalidateQueries({ queryKey: ['media'] })` after every mutation |

---

*Phase 3 research — RSG Profile Manufacturing*
*Research complete: 2026-06-14*

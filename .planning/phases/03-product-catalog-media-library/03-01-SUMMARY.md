---
plan: "03-01"
status: complete
completed: 2026-06-14
---

# Summary: DB Migration, Products/Media API & Seed Data

## What was built

- `backend/src/db/migrations/002_product_media.sql` — `product_media` junction table (FKs to products/media, unique constraint)
- `backend/src/db/migrate.ts` — now runs all `.sql` files in `migrations/` in sorted order (was hardcoded to 001 only)
- `backend/src/db/migrations/003_product_seed.sql` — UPDATE statements with real descriptions + specs JSON for all 10 products
- `backend/src/middleware/upload.ts` — multer memory storage, 10MB limit, image-only filter
- `backend/uploads/.gitkeep` + static serving at `/uploads` registered in `index.ts`; `.gitignore` updated to `backend/uploads/*` with `!backend/uploads/.gitkeep`
- `backend/src/routes/media.ts` — POST /upload (sharp -> webp + 400x400 thumbnail), GET /, PUT /:id (alt text), DELETE /:id (409 if linked to products), GET /:id/usage
- `backend/src/routes/products.ts` — GET /, GET /:slug (with linked media), PUT /:slug (description/specs/media_ids + fire-and-forget ISR revalidation), GET /:slug/media
- Registered `productsRouter` and `mediaRouter` in `backend/src/index.ts`

## Verification

- `npx tsc --noEmit` passes with no errors.
- **NOT verified against live DB**: `npm run migrate` fails with `ER_ACCESS_DENIED_ERROR` for user `rsg_profile` — the remote MySQL host (207.180.252.239) is rejecting the configured credentials/IP. This is a pre-existing infrastructure issue unrelated to this plan's code changes.

## Deviations

- None from plan structure. Seed content (descriptions/specs) was written based on `.planning/research/ASSET-INVENTORY.md` notes plus standard industry specs for each category, since the inventory doesn't list exact numeric specs for every product.

## Follow-ups / Blockers

- **DB access blocker**: fix MySQL user grants/host whitelist for `rsg_profile`@<current IP> on the Hostinger VPS, then run `npm run migrate` to apply 002/003 and verify the `truths` in 03-01-PLAN.md (10 products with description + specs, product_media table exists).
- Wave 2 (03-02 frontend product pages, 03-03 admin media library) and Wave 3 (03-04 admin catalog editor) are not yet started.
- Noticed unrelated uncommitted files in working tree: `backend/src/routes/leads.ts`, `backend/src/controllers/leads.controller.ts`, `backend/src/services/leads.service.ts` — left untouched (out of scope for this plan, appears to be in-progress Phase 4 work).

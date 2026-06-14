# Stack Research

**Domain:** B2B industrial catalog website + admin CMS (manufacturing/roofing sector)
**Researched:** 2026-06-14
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (App Router) | Public site — SSG/ISR rendering, routing, image optimization | Best-in-class for content-heavy marketing/catalog sites; ISR lets product/blog pages stay fast (SSG) while reflecting admin edits without full rebuilds. Client already specified Next.js. |
| Node.js | 20.x LTS | Backend API runtime | Client explicitly requires Node.js for performance; LTS gives stability for a production handover. |
| Express | 4.x | Backend API framework | Minimal, well-understood, huge ecosystem — appropriate for a single API serving both public site (read-heavy) and admin (CRUD + auth). Fastify is faster but adds learning-curve overhead not justified here. |
| MySQL | 8.0 | Primary database | Client-specified. MySQL 8 supports JSON columns (useful for flexible product specs) and CTEs. |
| React | 18.x | Admin SPA UI library | Pairs with Vite for a fast admin build; matches client's stack requirement. |
| Vite | 5.x | Admin SPA build tool | Fast dev server/HMR for the admin panel; replaces deprecated CRA. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| mysql2 | 3.x | MySQL driver / query execution | Use in `/backend` for all database access — connection pool (`createPool`) + parameterized prepared statements against products, pages, leads, media, blog, testimonials, settings tables. No ORM/codegen layer, per project decision. |
| Tailwind CSS | 3.x | Styling (frontend + admin) | Implements the "Premium Industrial" design tokens (gradients, glass panels, spacing scale) consistently across both apps via a shared config. |
| React Hook Form + Zod | 7.x / 3.x | Form handling + validation | "Get Quote" form, Contact form, and all admin CRUD forms — schema-driven validation shared between client and server. |
| TanStack Query | 5.x | Admin data fetching/caching | Admin SPA CRUD screens (products, leads, media, blog, testimonials) — handles loading/error/cache invalidation cleanly. |
| jsonwebtoken + bcrypt | 9.x / 5.x | Admin authentication | JWT session for `/admin` SPA talking to `/backend` API; bcrypt for password hashing. |
| Multer + sharp | 1.x / 0.33.x | Media upload + image processing | Media Library uploads — Multer handles multipart upload, sharp generates responsive sizes/formats (WebP) for product photos. |
| nodemailer | 6.x | SMTP lead notifications | Phase 7 (built last per SCOPE-DECISIONS) — sends email on new lead submission. |
| csv-parse / csv-stringify | 5.x | Leads export/import | Admin Leads flat list — CSV export and import. |
| Tiptap | 2.x | Rich text editor | Admin CMS for Blog posts and Events/News body content. |
| lucide-react | latest | Icon set | Replaces stock "Our Process" icons (per ASSET-INVENTORY.md) with a consistent, real icon set. |
| next-seo or native Metadata API | n/a | Per-page SEO meta | Next.js 15 Metadata API is sufficient — no extra dependency needed unless dynamic per-page meta from admin requires a thin helper. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | Type safety across all three apps | Use `strict: true`; share DB row types between `/backend` and `/admin` via a small local `types` folder if duplication becomes painful — don't over-engineer a shared package for a 3-app monorepo this size. |
| ESLint + Prettier | Lint/format | Matches CLAUDE.md quality gate (`eslint . --max-warnings 0`). |
| PM2 | Process management (VPS deploy) | Runs `/backend` (Express) and `/frontend` (Next.js standalone server) as managed processes; `/admin` is a static build served via nginx/Express static. |
| nginx | Reverse proxy | Routes `rsgprofilesheets.com/` → Next.js, `/admin` → admin static build, `/api` → Express. |
| concurrently | Local dev | Runs frontend + backend + admin dev servers together with one `npm run dev`. |

## Installation

```bash
# /backend
npm install express mysql2 jsonwebtoken bcrypt multer sharp nodemailer csv-parse csv-stringify zod
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcrypt @types/multer

# /frontend
npx create-next-app@latest frontend --typescript --tailwind --app
npm install zod react-hook-form

# /admin
npm create vite@latest admin -- --template react-ts
npm install tailwindcss @tanstack/react-query react-router-dom react-hook-form zod @tiptap/react @tiptap/starter-kit lucide-react axios
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Express | Fastify | If raw API throughput becomes a bottleneck (unlikely for this traffic profile) — Fastify's schema-based validation is nice but adds onboarding cost for a client handover. |
| mysql2 (raw queries) | Knex or Sequelize | If hand-written SQL becomes unwieldy as the schema grows (many joins, dynamic filters) — add a query builder later without changing the underlying driver. |
| Tiptap | react-quill | If editor requirements stay extremely simple (bold/italic/links only) — react-quill is lighter but less extensible for embedding images in blog posts. |
| Next.js ISR | Full SSR (`force-dynamic`) | Only if product/blog content changes so frequently that even short revalidate windows feel stale — not expected for a manufacturer catalog. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| WordPress / PHP | This project explicitly replaces the client's current WordPress site; client wants Node.js for performance | Next.js + Express + MySQL (this stack) |
| MongoDB / other NoSQL | Client specified MySQL; product/page/lead data is relational (products ↔ categories, leads ↔ sources) | MySQL 8 + mysql2 |
| Prisma / other ORMs (Sequelize, TypeORM) | Adds a codegen/build step and abstraction layer not wanted for this project — client decision is mysql2 only | mysql2 with parameterized queries + hand-written SQL migration scripts |
| Create React App | Deprecated, no longer maintained by the React team | Vite for the admin SPA |
| Client-side-only rendering for product pages | Hurts SEO for a lead-gen B2B site where organic search traffic matters | Next.js SSG/ISR for all public product/blog pages |
| Public per-kg pricing tables (seen on IndiaMART) | Explicitly out of scope — "Get Quote" only per SCOPE-DECISIONS.md | Quote-request CTA + spec sheets without prices |

## Stack Patterns by Variant

**If admin needs near-instant content reflection on the public site:**
- Use Next.js on-demand revalidation (`revalidatePath`/`revalidateTag`) triggered by the backend after a successful admin save
- Because full ISR `revalidate: N` windows (e.g. 60s) are usually fine, but instant feedback after editing a product page in the admin improves the client's confidence during handover/demo

**If image assets remain low-resolution (per ASSET-INVENTORY.md):**
- Use `next/image` with `sharp`-generated multiple sizes and a soft gradient/overlay treatment to mask low source resolution on hero sections
- Because several product categories only have 300x300 source photos — upscaling without a design treatment will look poor at hero scale

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| Next.js 15 | React 19 (bundled) | Next 15 App Router uses React 19 — keep `/admin`'s React 18 separate since it's an independent Vite app; no cross-version conflict because they're separate package.json/node_modules. |
| mysql2 3.x | MySQL 8.0 | Fully supported; use `mysql2/promise` for async/await, `createPool()` for connection pooling, and prepared statements for all parameterized queries. |
| Tailwind 3.x | Next.js 15 + Vite 5 | Both supported via their respective official integrations; keep one shared `tailwind.config` base (colors/fonts/spacing tokens) imported by both `/frontend` and `/admin` configs to enforce the design system consistently. |

## Sources

- Next.js 15 official docs (App Router, ISR, Metadata API) — verified patterns for SSG/ISR catalog sites
- mysql2 official docs — connection pooling, prepared statements, promise API
- Project context: `.planning/PROJECT.md`, `.planning/SCOPE-DECISIONS.md` — tech stack constraints (Node.js required, MySQL required, monorepo with /frontend /backend /admin, admin at `/admin` path)

---
*Stack research for: B2B industrial catalog + admin CMS*
*Researched: 2026-06-14*

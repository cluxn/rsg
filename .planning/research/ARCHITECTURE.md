# Architecture Research

**Domain:** B2B industrial catalog website + admin CMS (manufacturing/roofing sector)
**Researched:** 2026-06-14
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Visitor (Browser)                            │
│  rsgprofilesheets.com/  → Home, About, Product pages, Blog, Contact  │
│  rsgprofilesheets.com/admin → Admin SPA (authenticated)               │
└───────────────────────────────┬────────────────────────┬────────────┘
                                  │                        │
                         ┌────────▼────────┐      ┌────────▼────────┐
                         │   /frontend      │      │     /admin      │
                         │  Next.js (SSG/   │      │  React + Vite   │
                         │  ISR App Router) │      │  SPA (static)   │
                         └────────┬─────────┘      └────────┬────────┘
                                  │  fetch (build/revalidate)│ fetch (JWT)
                                  ▼                          ▼
                         ┌──────────────────────────────────────────┐
                         │              /backend                     │
                         │   Node.js + Express REST API              │
                         │  - Public read endpoints (products, blog, │
                         │    testimonials, settings)                │
                         │  - Admin CRUD endpoints (JWT-protected)   │
                         │  - Auth (login, JWT issue/verify)         │
                         │  - Media upload (Multer + sharp)          │
                         │  - Leads (create, list, export/import)    │
                         │  - Revalidation trigger → /frontend       │
                         └────────────────────┬───────────────────────┘
                                                │
                                       ┌────────▼────────┐
                                       │     MySQL 8      │
                                       │  products, pages,│
                                       │  leads, media,   │
                                       │  blog, events,   │
                                       │  testimonials,   │
                                       │  settings, users │
                                       └──────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|------------------|--------------------------|
| `/frontend` (Next.js) | Renders all public pages (Home, About, Contact, 10 product pages, Blog, Events) using SSG with ISR; submits Get Quote/Contact forms to `/backend` | App Router with route groups per page type; `fetch()` to backend API at build time and via ISR revalidation |
| `/admin` (React+Vite SPA) | Authenticated UI for managing products, media, blog, events, testimonials, leads, settings (WhatsApp number, SEO scripts) | React Router for SPA routes, TanStack Query for data, JWT stored in memory/httpOnly cookie |
| `/backend` (Express API) | Single source of truth for data: serves both public reads and admin CRUD; owns auth, validation, file uploads, leads export/import, revalidation triggers | Layered: routes → controllers → services → mysql2 queries |
| MySQL | Persistent storage for all content types | SQL migration scripts define tables per content type (see Project Structure) |
| nginx (VPS) | Routes `/` → Next.js, `/admin` → admin static build, `/api` → Express; TLS termination | Single VPS reverse proxy config |

## Recommended Project Structure

```
/ (repo root)
├── frontend/                  # Next.js public site
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx              # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── products/[slug]/page.tsx   # 10 category pages, slug-driven
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   └── events/[slug]/page.tsx
│   │   ├── layout.tsx          # shared layout: header, footer, WhatsApp icon, SEO scripts
│   │   └── api/revalidate/route.ts  # on-demand ISR revalidation endpoint
│   ├── components/             # design-system components (glass cards, hero, CTA, etc.)
│   ├── lib/api.ts               # typed fetch helpers to /backend
│   └── public/                  # static assets, favicon
│
├── backend/                    # Express API
│   ├── src/
│   │   ├── routes/              # products, pages, leads, media, blog, events, testimonials, settings, auth
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/           # auth (JWT verify), validation (zod), upload (multer)
│   │   ├── db/                   # connection pool + SQL migration scripts
│   │   └── index.ts               # Express app entry
│   └── uploads/                  # media library files (or swap for object storage later)
│
├── admin/                       # React + Vite SPA
│   ├── src/
│   │   ├── pages/                 # Login, Dashboard, Leads, Catalog (Products), Media, Content (Blog/Events/Testimonials), Settings
│   │   ├── components/
│   │   ├── lib/api.ts             # axios client with JWT interceptor
│   │   └── App.tsx                # React Router routes
│   └── vite.config.ts
│
├── tailwind.shared.config.ts     # shared design tokens imported by frontend + admin
└── .planning/                    # GSD planning artifacts
```

### Structure Rationale

- **Three top-level apps (`frontend`, `backend`, `admin`):** matches the client's monorepo/single-deploy constraint from PROJECT.md while keeping each app's tooling independent (Next.js, Express, Vite each have their own `package.json`/`node_modules`).
- **`backend/src/db/`:** single connection pool module + ordered SQL migration scripts are the source of truth for all content types — keeps schema changes centralized and reviewable as plain SQL.
- **`tailwind.shared.config.ts`:** one place for the "Premium Industrial" design tokens (colors, fonts, spacing scale, gradients) so `/frontend` and `/admin` stay visually consistent without a shared npm package — appropriately lightweight for a 3-app monorepo.
- **`frontend/app/api/revalidate/route.ts`:** gives `/backend` a single endpoint to call after an admin save, so edited content (products, blog) reflects on the public site quickly despite SSG/ISR.

## Architectural Patterns

### Pattern 1: ISR with On-Demand Revalidation

**What:** Public product/blog/page content is statically generated at build time, then revalidated either on a timer (e.g. `revalidate: 3600`) or immediately when the admin saves a change, via a call from `/backend` to `/frontend`'s revalidate API route.
**When to use:** All public content pages (products, blog, events, home/about/contact if they pull dynamic content like testimonials).
**Trade-offs:** Fast page loads and good SEO (static HTML) vs. a small amount of plumbing to wire revalidation calls into every admin save handler.

**Example:**
```typescript
// backend: after saving a product
await fetch(`${FRONTEND_URL}/api/revalidate?path=/products/${slug}&secret=${REVALIDATE_SECRET}`);
```

### Pattern 2: Layered Express API (routes → controllers → services → mysql2)

**What:** Each resource (products, leads, media, blog, etc.) has a route file (HTTP concerns), a controller (request/response shaping), and a service (business logic + parameterized mysql2 queries).
**When to use:** Every `/backend` resource — keeps admin CRUD and public read endpoints consistent and testable.
**Trade-offs:** Slightly more files than a single monolithic route file, but keeps validation/auth/business logic separated as the admin panel grows (10 product categories, leads, blog, events, testimonials, settings, media).

**Example:**
```typescript
// routes/products.ts
router.get('/products', productController.list);
router.get('/products/:slug', productController.getBySlug);
router.put('/products/:slug', requireAuth, productController.update); // admin-only
```

### Pattern 3: Settings Table for Configurable Contact/Integration Fields

**What:** A single `settings` key-value table (or single-row config table) stores admin-configurable values: WhatsApp number, business email/phone, SEO script snippets, social links.
**When to use:** Anywhere SCOPE-DECISIONS.md specifies "client configures post-launch" — WhatsApp number, SEO scripts, contact email.
**Trade-offs:** Avoids hardcoding values that change after handover and avoids a schema migration every time a new configurable field is needed; slightly less type-safe than dedicated columns, mitigated by validating known keys in the admin Settings form.

**Example:**
```typescript
// settings table: key (string, PK), value (text)
// e.g. { key: 'whatsapp_number', value: '+91...' }, { key: 'seo_scripts', value: '<script>...</script>' }
```

## Data Flow

### Request Flow (Public Page)

```
Visitor requests /products/colour-coated-roofing-sheet
    ↓
Next.js (SSG page, served from cache or revalidated)
    ↓ (build time / revalidation)
GET /backend/products/colour-coated-roofing-sheet
    ↓
mysql2 query (prepared statement) → MySQL
    ↓
JSON response (specs, images, description, meta)
    ↓
Rendered static HTML returned to visitor
```

### Request Flow (Get Quote Submission)

```
Visitor submits Get Quote form (product page)
    ↓
POST /backend/leads { name, contact, productSlug, message, sourcePage }
    ↓
Validation (zod) → mysql2 INSERT into `leads` table
    ↓
Response → confirmation UI on /frontend
    ↓ (Phase 7 only)
nodemailer SMTP notification to client's inbox
```

### Admin Edit Flow

```
Admin logs into /admin (JWT issued by /backend)
    ↓
Admin edits a product's specs/images via /admin SPA
    ↓
PUT /backend/products/:slug (JWT-protected)
    ↓
mysql2 UPDATE → MySQL
    ↓
/backend calls /frontend's revalidate API for /products/:slug
    ↓
Next.js regenerates the static page on next request
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|----------------------------|
| 0-1k visitors/day (expected launch traffic) | Single VPS running all three apps (PM2 + nginx) is sufficient — this is the expected scale for a regional B2B manufacturer site |
| 1k-10k visitors/day | No structural change needed; consider moving media uploads to object storage (e.g. S3-compatible) if disk I/O on the VPS becomes a constraint |
| 10k+ visitors/day | Add CDN in front of `/frontend` static assets; this is well beyond the project's expected scope and shouldn't drive any v1 decisions |

### Scaling Priorities

1. **First bottleneck (if it ever occurs):** Media storage on local disk filling up or slowing — mitigate by storing uploads in a dedicated `uploads/` volume and keeping `sharp`-generated sizes reasonable (don't store unbounded full-resolution originals if not needed).
2. **Second bottleneck (unlikely at this scale):** MySQL query load from the public site re-fetching content on every ISR revalidation — mitigate by setting sensible `revalidate` windows (e.g. hours, not seconds) for content that rarely changes (product specs).

## Anti-Patterns

### Anti-Pattern 1: Direct DB Access from Next.js Pages

**What people do:** Import the mysql2 connection pool directly into `/frontend` and query MySQL from page components.
**Why it's wrong:** Violates the client's requirement for a Node.js API serving both public site and admin; duplicates DB access logic across two codebases; couples the public site's deploy to DB schema changes.
**Do this instead:** `/frontend` always fetches from `/backend`'s REST API, even at build time (SSG `fetch` calls hit the API).

### Anti-Pattern 2: Hardcoding Configurable Values

**What people do:** Hardcode the WhatsApp number, business email, or analytics script directly into layout components "to ship faster."
**Why it's wrong:** SCOPE-DECISIONS.md explicitly requires these to be admin-configurable post-launch; hardcoding means a developer is needed for what should be a content edit.
**Do this instead:** Read from the `settings` table via `/backend`, with the documented placeholder (`shivam.gupta09@gmail.com`) as the seeded default — not a literal in component code.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|------------------------|-------|
| WhatsApp Click-to-Chat | `https://wa.me/<number>` link, number from `settings` table | No API/SDK needed — simple link with admin-configurable number |
| Google Maps | `<iframe>` embed on Contact page | No API key required for basic embed |
| Google Analytics / GTM | Injected via SEO > Scripts admin field, rendered in `frontend/app/layout.tsx` `<head>` | Ships with no script configured; admin pastes snippet post-launch |
| SMTP (lead notifications) | nodemailer in `/backend`, triggered after lead creation | Phase 7 — built last per SCOPE-DECISIONS.md |
| n8n webhook (optional, lead notifications) | `/backend` POSTs lead payload to client-configured webhook URL from `settings` | Phase 7, alongside SMTP |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| `/frontend` ↔ `/backend` | REST (fetch), public endpoints unauthenticated, revalidate endpoint secret-protected | All public content reads go through `/backend` — never direct DB |
| `/admin` ↔ `/backend` | REST (axios), JWT bearer auth on all admin endpoints | Admin SPA never talks to MySQL directly |
| `/backend` ↔ MySQL | mysql2 connection pool (parameterized queries) | Single schema (SQL migrations), single source of truth |

## Sources

- Next.js 15 App Router architecture docs (ISR, on-demand revalidation, Metadata API)
- Express layered architecture conventions (routes/controllers/services)
- Project constraints: `.planning/PROJECT.md` (monorepo, Node.js API, MySQL, admin at `/admin` path)

---
*Architecture research for: B2B industrial catalog + admin CMS*
*Researched: 2026-06-14*

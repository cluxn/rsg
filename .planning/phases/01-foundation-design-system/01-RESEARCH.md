# Phase 1: Foundation & Design System — Research

**Phase:** 1
**Researched:** 2026-06-14
**Status:** Complete

## ## RESEARCH COMPLETE

---

## 1. Monorepo Scaffold Strategy

### Approach: Workspaces-light (no Turbo/Nx)
Three sibling folders with their own `package.json` files, tied together by a root `package.json` using `concurrently` for local dev. No workspace hoisting needed — these are three distinct runtimes (Next.js, Express, Vite) with different build toolchains, so workspaces would add complexity without benefit.

**Root `package.json` scripts:**
```json
"dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\" \"npm run dev --prefix admin\"",
"build": "npm run build --prefix frontend && npm run build --prefix backend && npm run build --prefix admin"
```

**Shared design tokens:** One `tailwind.shared.config.ts` at repo root, imported by both `frontend/tailwind.config.ts` and `admin/tailwind.config.ts`. No shared package — just a direct `require('../tailwind.shared.config')`. This avoids a workspace publish cycle while keeping tokens in one place.

### Port Convention (local dev)
- `/frontend` Next.js dev: `:3000`
- `/backend` Express: `:4000`
- `/admin` Vite: `:5173`

---

## 2. MySQL Schema Design

### All Phase 1 Tables

```sql
-- Admin users
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings (key-value, Pattern 3 from ARCHITECTURE.md)
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products/categories
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  specs JSON,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pages (per-page SEO meta)
CREATE TABLE pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media library
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  alt_text VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100),
  size INT,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events / News
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT,
  event_date DATE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_city VARCHAR(255),
  rating DECIMAL(2,1),
  source ENUM('google','indiamart','justdial','other') DEFAULT 'google',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  product_interest VARCHAR(255),
  message TEXT,
  source_page VARCHAR(500),
  webhook_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Seed Data (Phase 1 only)
- `admin_users`: one row with email + bcrypt-hashed password
- `settings`: `whatsapp_number` (empty), `business_email` (`shivam.gupta09@gmail.com`), `seo_scripts` (empty)
- `products`: 10 rows with slugs and display names (no content yet — content comes in Phase 3)

---

## 3. Admin Authentication Pattern

### JWT + bcrypt (from STACK.md)
- Login: `POST /api/auth/login` → validates email/password, returns signed JWT (7-day expiry)
- JWT payload: `{ id, email, iat, exp }`
- Token storage: **httpOnly cookie** (prevents XSS; set via `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Path=/`)
- Every admin route uses a `requireAuth` middleware that reads the cookie, verifies with `jsonwebtoken.verify()`
- Frontend admin SPA: axios instance with `withCredentials: true` — cookie sent automatically

### Auth Middleware Pattern
```ts
// backend/src/middleware/auth.ts
export const requireAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 4. ISR Revalidation Pattern

Next.js App Router on-demand revalidation:
```ts
// frontend/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
export async function POST(req: Request) {
  const { secret, path, tag } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```
Backend calls this endpoint after any admin save. `REVALIDATE_SECRET` must be in both `/frontend/.env.local` and `/backend/.env`.

---

## 5. Premium Industrial Design System

### Color Tokens
```ts
// tailwind.shared.config.ts
colors: {
  navy:      '#0F2B4C',   // dominant: hero overlays, sidebar text, headings
  steel:     '#2E6DA4',   // secondary: gradient midpoint, section accents
  cyan:      '#4AB3D3',   // gradient endpoint, subtle highlights
  orange:    '#E8590C',   // CTA buttons, badges, key stats
  'off-white': '#F5F6F8', // page surfaces
  'glass-bg': 'rgba(255, 255, 255, 0.08)',  // glassmorphism fill
}
```

### Gradient
```css
/* Navy → steel-blue → cyan, diagonal */
background: linear-gradient(135deg, #0F2B4C 0%, #2E6DA4 50%, #4AB3D3 100%);
```

### Glassmorphism Panel
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 12px;
```

### Typography
- Headings: Sora (Google Fonts) — weight 600/700
- Body: Source Sans 3 (Google Fonts) — weight 400/600
- Min body size: 16px, line-height: 1.7
- Load via `next/font/google` in frontend, `@import` in admin's index.css

### Spacing / Layout Grid
- Max-width container: 1280px, centered
- Desktop padding: `px-16` (64px each side) or `px-20` (80px)
- Mobile padding: `px-6` (24px)
- Section spacing: `py-24` (96px desktop), `py-12` (48px mobile)

### Core Components (Phase 1 /style-guide and admin dashboard)
- `GradientHero` — full-width gradient background container
- `GlassCard` — frosted glass panel (backdrop-filter + rgba background)
- `CTAButton` — orange button variant + navy ghost variant
- `SectionContainer` — max-width wrapper with gutters

---

## 6. Admin Panel (shadcn/ui Theming)

### Why shadcn works here
shadcn/ui uses CSS variables for theming, making it trivial to override with RSG's palette. The Tailwind config extension handles the token layer; shadcn's `components.json` sets `baseColor: "neutral"` as the primitive, then CSS variable overrides in `globals.css` apply RSG colors.

### CSS Variable Overrides
```css
/* admin/src/index.css */
:root {
  --background: 215 30% 97%;       /* off-white */
  --foreground: 215 50% 15%;       /* near-navy text */
  --primary: 210 55% 40%;          /* steel-blue for buttons/links */
  --primary-foreground: 0 0% 100%;
  --accent: 20 85% 48%;            /* orange #E8590C */
}
```

### Admin Page Structure (Phase 1 dashboard shell)
- `AdminLayout` — sidebar + header wrapper
- `Sidebar` — off-white background, navy/steel-blue text, active state uses steel-blue fill
- Login page — gradient background + centered GlassCard containing shadcn Form fields + CTA button

---

## 7. Validation Architecture

### Test Strategy for Phase 1

**Runnable smoke tests (verify each success criterion):**

1. **INFRA-01** (monorepo starts): `npm run dev` exits 0 after 5s; curl `:3000`, `:4000/health`, `:5173` each return 200.
2. **INFRA-02** (schema): Run migration script against test DB; `SHOW TABLES` returns all 9 expected table names.
3. **INFRA-03** (admin login): `POST :4000/api/auth/login` with seeded credentials returns 200 + `Set-Cookie` header.
4. **INFRA-04** (JWT protection): `GET :4000/api/admin/leads` without cookie returns 401.
5. **DESIGN-01** (design tokens in DOM): Load `:3000/style-guide`; assert page HTML contains `sora`, `#0F2B4C`, `backdrop-filter`.
6. **DESIGN-02** (layout grid): `/style-guide` container element has `max-width: 1280px`.
7. **DESIGN-03** (contrast/font size): `/style-guide` body text computed style `font-size >= 16px`.
8. **ISR** (revalidation): Build → view static page → update content → POST `/api/revalidate` → reload page → see updated content.

---

## 8. Key Implementation Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `backdrop-filter` not rendering in Chrome without GPU acceleration | Always pair glassmorphism with `will-change: transform` or a solid fallback `background-color` on the same element |
| Hostinger MySQL remote connection latency in dev | Connection pool (`createPool`) with `connectionLimit: 5`; use `mysql2/promise` for async/await |
| shadcn CSS variables conflicting with custom Tailwind tokens | Keep custom tokens in `extend.colors`, shadcn CSS vars in `--hsl-format` — they don't clash if namespaced |
| concurrently port conflicts if any port is already in use | Add `--kill-others-on-fail` to concurrently flags; document port convention in README |
| httpOnly cookie not sent by admin SPA in CORS setup | Set `credentials: 'include'` on fetch/axios AND `res.setHeader('Access-Control-Allow-Credentials', 'true')` + specific origin on backend |

---

## Validation Architecture

```yaml
dimensions:
  - name: Monorepo starts
    approach: npm run dev; curl each port
    tool: manual/shell
  - name: Schema completeness
    approach: Run migration; SHOW TABLES
    tool: mysql CLI
  - name: Admin auth E2E
    approach: POST /login → get cookie → GET protected route
    tool: curl/Postman
  - name: Design tokens in DOM
    approach: Load /style-guide; inspect computed styles
    tool: browser devtools / Playwright
  - name: ISR revalidation
    approach: Build → POST /revalidate → verify page updated
    tool: manual
```

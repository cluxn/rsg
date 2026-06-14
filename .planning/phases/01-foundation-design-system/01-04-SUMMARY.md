---
plan: "01-04"
phase: 1
title: "Admin Auth + Dashboard Shell"
status: complete
completed_at: "2026-06-14"
requirements_covered:
  - INFRA-03
  - INFRA-04
  - DESIGN-01
self_check: PASSED
key-files:
  created:
    - admin/components.json
    - admin/src/lib/utils.ts
    - admin/src/lib/api.ts
    - admin/src/lib/auth.ts
    - admin/src/components/ui/button.tsx
    - admin/src/components/ui/input.tsx
    - admin/src/components/ui/label.tsx
    - admin/src/components/ui/GlassStatCard.tsx
    - admin/src/components/layout/Sidebar.tsx
    - admin/src/components/layout/Header.tsx
    - admin/src/components/layout/AdminLayout.tsx
    - admin/src/components/ProtectedRoute.tsx
    - admin/src/contexts/AuthContext.tsx
    - admin/src/pages/Login.tsx
    - admin/src/pages/Dashboard.tsx
  modified:
    - admin/src/App.tsx
    - admin/src/index.css
    - admin/tsconfig.app.json
    - admin/package.json
---

# Plan 01-04 Summary: Admin Auth + Dashboard Shell

## What Was Built

Full admin authentication flow and dashboard shell for the Vite/React admin SPA:

- **shadcn/ui setup** — `components.json`, `lib/utils.ts` (cn helper), and hand-crafted UI primitives (`button.tsx`, `input.tsx`, `label.tsx`) with RSG-mapped CSS variables. Peer deps installed: `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-label`, `@radix-ui/react-slot`.
- **API client** (`lib/api.ts`) — Axios with `withCredentials: true`, baseURL `/api` (proxied to :4000), 401 interceptor redirects to `/login` (loop-safe: checks `pathname !== '/login'`).
- **Auth helpers** (`lib/auth.ts`) — `login`, `logout`, `getMe` wrapping the backend `/api/auth/*` routes.
- **AuthContext** — `AuthProvider` calls `getMe()` on mount, exposes `admin`, `loading`, `logout`. `useAuth` hook with provider guard.
- **ProtectedRoute** — Redirects to `/login` when `admin` is null; shows loading state while session resolves.
- **Login page** — Full-width gradient background + frosted-glass card (same RSG design language as public site). Show/hide password toggle (Eye/EyeOff from lucide-react). Error state with `role="alert"`.
- **AdminLayout** — Fixed 256px off-white sidebar with 6 nav items (Dashboard/Leads/Catalog/Media Library/Content/Settings), active link styling via NavLink. Fixed header (ml-64) shows logged-in email + ghost logout button.
- **GlassStatCard** — Gradient-premium background with glass overlay, `willChange: 'transform'`. Props: label, value, icon.
- **Dashboard page** — 4 stat cards (Leads=0, Products=10, Media=0, Blog Posts=0). Responsive grid.
- **App.tsx** — React Router v7 + QueryClientProvider + AuthProvider. Routes: `/login` → LoginPage, `/` → ProtectedRoute(DashboardPage), `*` → redirect to `/`.
- **tsconfig.app.json** — Added `baseUrl` + `paths` for `@/*` alias (TypeScript resolution).

## Key Technical Decisions

- **shadcn/ui installed manually** — CLI requires interactive TTY. Installed peer deps and created component files directly from shadcn templates, adapted for Tailwind v4 (CSS variables work identically).
- **Tailwind v4 CSS variables** — shadcn's `hsl()` CSS variable pattern works with Tailwind v4's `@layer base` approach; `bg-primary`, `text-foreground` etc. resolve correctly via the CSS variables set in `index.css`.
- **Show/hide password** — Added Eye/EyeOff toggle to password field (user-requested feature).

## Self-Check

- [x] `admin/components.json` exists
- [x] `admin/src/components/ui/button.tsx` exists (shadcn Button primitive)
- [x] CSS variables in `admin/src/index.css` include `--primary`, `--accent`, `--background`
- [x] `AuthProvider` calls `getMe()` on mount; sets admin or null
- [x] `ProtectedRoute` redirects to `/login` when admin is null
- [x] Login page has gradient + glass card with show/hide password toggle
- [x] Sidebar renders 6 nav items in correct order: Dashboard, Leads, Catalog, Media Library, Content, Settings
- [x] Dashboard shows 4 glass stat cards
- [x] App.tsx uses React Router + AuthProvider + QueryClientProvider
- [x] `cd admin && npx tsc --noEmit` → exit 0

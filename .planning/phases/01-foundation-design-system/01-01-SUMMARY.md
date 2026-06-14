---
plan: "01-01"
phase: 1
title: "Monorepo Scaffold + Shared Tailwind Config"
status: complete
completed_at: "2026-06-14"
requirements_covered:
  - INFRA-01
self_check: PASSED
---

# Plan 01-01 Summary: Monorepo Scaffold + Shared Tailwind Config

## What Was Built

Scaffolded the full monorepo from scratch with three apps and a shared design token system:

- **`/frontend`** — Next.js 16, React 19, Tailwind v4, TypeScript strict. Entry at `:3000`. RSG placeholder home page. Fonts wired via `next/font/google` (Sora + Source Sans 3). `output: 'standalone'` set in `next.config.ts`.
- **`/backend`** — Express 5, TypeScript strict, mysql2, jsonwebtoken, bcrypt, cookie-parser, cors, zod, multer, sharp, nodemailer. Entry at `:4000`. Health endpoint at `GET /health`. `ts-node-dev` for dev mode.
- **`/admin`** — Vite 6, React 19, Tailwind v4 (via `@tailwindcss/vite`). Entry at `:5173`. Proxy `/api` → `:4000` via vite.config.ts.
- **`tailwind.shared.css`** — Root-level Tailwind v4 CSS `@theme` block declaring all RSG brand tokens: colors (`navy`, `steel`, `cyan`, `orange`, `off-white`), font families (`heading`, `body`), max-width (`container: 1280px`), backdrop blur (`glass`), and premium gradient. Imported by both `frontend/app/globals.css` and `admin/src/index.css`.
- **Root `package.json`** — `npm run dev` starts all three via `concurrently --kill-others-on-fail`.

## Key Technical Decisions

- **Tailwind v4 instead of v3** — `create-next-app@latest` scaffolded Next.js 16 with Tailwind v4. Adapted plan to use CSS `@theme` blocks (v4 native) instead of JS `tailwind.config.ts` (v3). Shared tokens are in `tailwind.shared.css` instead of `tailwind.shared.config.ts`. Functionally equivalent — Tailwind utilities like `bg-navy`, `text-steel`, `font-heading` work identically.
- **Express 5** — npm installed Express 5.2.x (latest), not Express 4.x as the plan specified. Express 5 is stable and backward-compatible for our use case.

## Files Created

- `package.json` + `package-lock.json` (root)
- `tailwind.shared.css` (root — RSG design tokens)
- `.env.example` (root)
- `README.md` (root)
- `.gitignore` (updated)
- `frontend/` — full Next.js 16 scaffold + updated layout.tsx, page.tsx, globals.css, next.config.ts
- `backend/` — package.json, tsconfig.json, src/index.ts, src/routes/health.ts, .env.example
- `admin/` — full Vite scaffold + updated vite.config.ts, src/App.tsx, src/index.css

## Self-Check

- [x] `cd frontend && npx tsc --noEmit` → exit 0
- [x] `cd backend && npx tsc --noEmit` → exit 0
- [x] `cd admin && npx tsc --noEmit` → exit 0
- [x] `tailwind.shared.css` exports: `navy`, `steel`, `cyan`, `orange`, `off-white`, `heading`, `body` tokens
- [x] Root `package.json` parseable, `concurrently` in devDependencies
- [x] `.gitignore` includes `node_modules/`, `.env`, `frontend/.next/`, `backend/dist/`, `admin/dist/`
- [x] All three apps structured and TypeScript-compliant

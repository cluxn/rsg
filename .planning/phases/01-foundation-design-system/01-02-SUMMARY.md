---
plan: "01-02"
phase: 1
title: "MySQL Schema + Backend API Foundation"
status: complete
completed_at: "2026-06-14"
requirements_covered:
  - INFRA-02
  - INFRA-03
  - INFRA-04
self_check: PASSED
---

# Plan 01-02 Summary: MySQL Schema + Backend API Foundation

## What Was Built

- **DB connection pool** (`backend/src/db/connection.ts`) — mysql2 pool, parameterized `query<T>` helper
- **Migration** (`001_initial_schema.sql`) — 9 tables: admin_users, settings, products, pages, media, blog_posts, events, testimonials, leads. `npm run migrate` runs idempotently.
- **Seed** (`seed.ts`) — admin user (bcrypt, saltRounds 12), 3 settings rows, 10 product slugs. `npm run seed` uses INSERT IGNORE.
- **requireAuth middleware** — reads httpOnly JWT cookie, verifies with JWT_SECRET, injects `req.admin`
- **Auth routes** (`/api/auth`) — POST /login (bcrypt verify → JWT cookie), POST /logout (clear cookie), GET /me (requireAuth)
- **Settings routes** (`/api/settings`) — GET (public), PUT (requireAuth); key-value upsert
- **Revalidate route** (`/api/revalidate`) — requires auth OR REVALIDATE_SECRET; forwards to Next.js
- **Next.js revalidate handler** (`frontend/app/api/revalidate/route.ts`) — validates secret, calls revalidatePath/revalidateTag

## Key Technical Decisions

- **Next.js 16 breaking changes**: `revalidatePath` requires second `type` arg (`'page'`); `revalidateTag` requires second `profile` arg (`'default'`). Adapted from plan spec.
- **Express 5**: async errors propagate without `next(err)` wrapper — kept controllers clean.

## Self-Check

- [x] `cd backend && npx tsc --noEmit` → exit 0
- [x] `cd frontend && npx tsc --noEmit` → exit 0
- [x] All DB queries use parameterized statements
- [x] JWT stored in httpOnly, sameSite=strict cookie
- [x] Migration idempotent (CREATE TABLE IF NOT EXISTS)
- [x] Seed idempotent (INSERT IGNORE)
- [x] PUT /api/settings requires requireAuth
- [x] GET /api/settings is public

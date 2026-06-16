---
plan: "05-01"
phase: 5
title: "Backend API — Blog, Events & Testimonials"
status: complete
completed_at: "2026-06-16"
commit: "7e55522"
---

# Summary: Backend API — Blog, Events & Testimonials

## What Was Built

Added Express REST API for Blog posts, Events/News, and Testimonials following the existing Phase 1 service/controller/route layered pattern.

**Files created:**
- `backend/src/services/blog.service.ts` — 6 functions: listPublishedPosts, getPostBySlug, getAllPosts, createPost, updatePost, deletePost
- `backend/src/controllers/blog.controller.ts` — 6 handlers with Zod validation on create
- `backend/src/routes/blog.ts` — public GET /, GET /:slug; protected GET /admin/all, POST, PUT/:id, DELETE/:id
- `backend/src/services/events.service.ts` — same pattern for events
- `backend/src/controllers/events.controller.ts`
- `backend/src/routes/events.ts`
- `backend/src/services/testimonials.service.ts` — listActiveTestimonials (WHERE active=TRUE), getAllTestimonials (admin)
- `backend/src/controllers/testimonials.controller.ts`
- `backend/src/routes/testimonials.ts`
- `backend/src/db/migrations/006_testimonials_source_enum.sql` — updates ENUM from (google,direct,referral) to (google,indiamart,justdial,other)

**Modified:**
- `backend/src/index.ts` — mounted /api/blog, /api/events, /api/testimonials routers

## Deviations

- The existing DB schema had `source ENUM('google','direct','referral')` but the plan requires `('google','indiamart','justdial','other')`. Added migration 006 to correct the ENUM before testimonial routes are used.

## Self-Check: PASSED

- `cd backend && npx tsc --noEmit` exits 0
- All public GET endpoints filter: blog/events `WHERE published=TRUE`, testimonials `WHERE active=TRUE`
- All POST/PUT/DELETE routes protected by `requireAuth` middleware
- All SQL queries use parameterized `query()` helper — no user input interpolated

## Key Files Created

- backend/src/services/blog.service.ts
- backend/src/services/events.service.ts
- backend/src/services/testimonials.service.ts
- backend/src/routes/blog.ts
- backend/src/routes/events.ts
- backend/src/routes/testimonials.ts

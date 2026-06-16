---
plan: "05-03"
phase: 5
status: complete
completed_at: "2026-06-16"
commit: "abd15e1"
---
# Summary: Public Frontend — Blog & Events Pages

## What Was Built
- `frontend/lib/content.ts` — getBlogPosts, getBlogPost, getEvents, getTestimonials (all with ISR revalidate:60)
- `frontend/components/blog/BlogCard.tsx` — Post card with navy/steel design tokens
- `frontend/components/blog/BlogPostBody.tsx` — dangerouslySetInnerHTML prose renderer
- `frontend/app/(site)/blog/page.tsx` — Blog list with GradientHero header
- `frontend/app/(site)/blog/[slug]/page.tsx` — Detail page with generateStaticParams + generateMetadata + notFound()
- `frontend/app/(site)/events/page.tsx` — Events list with GradientHero header
- Added `@plugin "@tailwindcss/typography"` to globals.css (v4 plugin syntax)

## Deviations
- No PageHeader component existed; used GradientHero (existing pattern from About page) instead
- params is a Promise in this Next.js version — used `await params` accordingly

## Self-Check: PASSED
- `cd frontend && npx tsc --noEmit` exits 0

# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning

<domain>
## Phase Boundary

A locally runnable monorepo (`/frontend`, `/backend`, `/admin`) with the MySQL schema, admin authentication, a configurable settings table, on-demand ISR revalidation, and the "Premium Industrial" design system (fonts, colors, gradients, glassmorphism components, layout grid) — ready for content pages to be built on top in later phases.

This discussion focused on HOW to implement the parts of Phase 1 not already locked by `.planning/SCOPE-DECISIONS.md`: the admin panel's visual style, the design-system verification page, branding placeholders, and the settings table's Phase 1 scope.

</domain>

<decisions>
## Implementation Decisions

### Admin Panel Visual Style
- **D-01:** Admin panel gets the full "Premium Industrial" treatment — gradients and glassmorphism, same visual language as the public site (not a separate "clean admin" theme).
- **D-02:** Admin login page = navy→steel-blue→cyan gradient background with a centered frosted-glass login card, reusing the same hero gradient/glass components as the public site.
- **D-03:** Admin sidebar is light/neutral (off-white, matching content area) — navy/steel-blue used for text, icons, and active-state accents, not as a dark sidebar background.
- **D-04:** Data-heavy screens (Leads list, product/media tables) use flat cards/tables for readability. Glassmorphism is reserved for the dashboard stat cards, login screen, and key feature/summary panels — not applied to dense tabular data.
- **D-05:** Dashboard shell (authenticated landing page, success criteria #3) shows glass stat cards for counts (leads, products, media, blog posts — all zero at this stage) plus the sidebar/header shell. This is what "proves" the design system end-to-end for Phase 1.
- **D-06:** `/admin` uses **shadcn/ui** as its component library (tables, forms, dialogs, buttons, etc.), themed with RSG's navy/steel-blue/orange palette and Sora/Source Sans 3 fonts via the shared Tailwind config. `/frontend` (public site) does NOT use shadcn/ui — it stays fully custom Tailwind components for the marketing-heavy gradient/glassmorphism design, which doesn't map well to shadcn's default primitives.

### Design System Showcase Page
- **D-07:** Success criteria #4's "test page" becomes a **permanent `/style-guide` route on `/frontend`** — living design-system documentation/QA reference reused as new components are added in Phases 2-6.
- **D-08:** `/style-guide` includes: color palette swatches, font samples (Sora/Source Sans 3 at all sizes), gradient examples, glassmorphism panel demo, spacing/grid demo, AND the core reusable components built in Phase 1 (buttons, cards, badges, form inputs) — not tokens alone.
- **D-09:** `/style-guide` is dev-only — renders only when `NODE_ENV !== 'production'` (404/not rendered in production), so it's not reachable on the live public site.

### Branding Assets
- **D-10:** Reuse the existing `rsg-logo.png` (from `.planning/research/ASSET-INVENTORY.md` — the "busy stock-template" logo, used as color reference only) and the existing favicon as functional placeholders in the admin sidebar/header and as the site favicon. These are swappable later without structural changes — just replace the asset file when a redesigned logo is available.

### Settings Table Scope (Phase 1)
- **D-11:** Phase 1 delivers the `settings` table + a GET/PUT API only, seeded with placeholder values. The admin **Settings > General UI** (for editing WhatsApp number, business email, etc.) is deferred to **Phase 2**, built alongside the WhatsApp floating-icon feature that consumes those values.
- **D-12:** Phase 1 seeds only the contact-essential keys: `whatsapp_number` (empty), `business_email` (`shivam.gupta09@gmail.com` placeholder per SCOPE-DECISIONS.md), `seo_scripts` (empty). Additional keys (business phone, address, hours, social links) are added in Phase 2 when the Contact page's exact needs are defined — the key-value table design means no migration is needed to add them later.

### Claude's Discretion
- Exact shadcn/ui component selection (which primitives to install) and how the shared Tailwind theme config is wired into shadcn's theming — implementation detail for planner/researcher.
- Specific layout/structure of the `/style-guide` page beyond the required sections (D-08).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Direction & Scope (locked decisions)
- `.planning/SCOPE-DECISIONS.md` — "Premium Industrial" design direction (gradients, glassmorphism, fonts, color rhythm, layout/whitespace rules), admin navigation structure (Dashboard/Leads/Catalog/Media Library/Content/Settings), settings/contact placeholder decisions, lead webhook integration.
- `.planning/PROJECT.md` — monorepo structure, tech stack constraints, contact info placeholder (`shivam.gupta09@gmail.com`).
- `.planning/REQUIREMENTS.md` — INFRA-01..04, DESIGN-01..03 requirement definitions for Phase 1.

### Architecture & Stack Research
- `.planning/research/ARCHITECTURE.md` — recommended project structure (`/frontend`, `/backend`, `/admin`), settings key-value table pattern (Pattern 3), layered Express API pattern, ISR revalidation pattern.
- `.planning/research/STACK.md` — recommended libraries (Next.js 15, Express, mysql2, Tailwind, JWT/bcrypt, etc.). Note: this predates the shadcn/ui decision (D-06) — planner should add shadcn/ui + its Radix dependencies for `/admin` on top of this list.

### Asset References
- `.planning/research/ASSET-INVENTORY.md` — existing `rsg-logo.png` and favicon (`cropped-cropped-RSG-Site-Icon`) to reuse per D-10.

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield project — no `/frontend`, `/backend`, or `/admin` code exists yet. No codebase maps, no prior phase CONTEXT.md files (Phase 1 is first). `.env` already contains a working remote MySQL connection (Hostinger-hosted) and `LEAD_WEBHOOK_URL` — both ready for `/backend` to use.

</code_context>

<specifics>
## Specific Ideas

- Admin should feel like "the same product" as the public site — full Premium Industrial visual language, not a generic/utilitarian admin look, despite using shadcn/ui as the underlying component library (shadcn themed to match, not used at default styling).
- "Branded but flat" was explicitly considered and rejected in favor of full Premium Industrial for admin — but tempered by D-04 (flat tables for data screens) and D-06 (shadcn for structural primitives) to keep it buildable.

</specifics>

<deferred>
## Deferred Ideas

- Admin Settings > General UI (WhatsApp number, business email editing) — deferred to Phase 2 (D-11), alongside the WhatsApp icon feature.
- Additional settings keys (business phone, address, hours, social links) — added in Phase 2 when Contact page requirements are concrete (D-12).

### Reviewed Todos (not folded)
None — no pending todos matched Phase 1 (`todo_count: 0`).

</deferred>

---

*Phase: 1-foundation-design-system*
*Context gathered: 2026-06-14*

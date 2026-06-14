# Phase 1: Foundation & Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-14
**Phase:** 01-foundation-design-system
**Areas discussed:** Admin panel visual style, Design system showcase page, Branding assets (logo/favicon), Settings table scope for Phase 1

---

## Admin Panel Visual Style

| Option | Description | Selected |
|--------|-------------|----------|
| Branded but flat | Same colors/fonts as public site, no gradients/glass | |
| Full Premium Industrial | Gradients and glassmorphism throughout admin too | ✓ |
| Generic admin UI | Off-the-shelf neutral look, no RSG branding | |

**User's choice:** Full Premium Industrial

| Option | Description | Selected |
|--------|-------------|----------|
| Glass login card on gradient | Navy→steel-blue→cyan gradient bg + frosted-glass login card | ✓ |
| Simple branded form | Flat navy/white card, no gradient | |

**User's choice:** Glass login card on gradient

| Option | Description | Selected |
|--------|-------------|----------|
| Dark navy sidebar | Sidebar uses navy/steel-blue gradient family | |
| Light/neutral sidebar | Off-white sidebar, navy for text/icons only | ✓ |

**User's choice:** Light/neutral sidebar

| Option | Description | Selected |
|--------|-------------|----------|
| Flat cards/tables, glass for chrome only | Tables/lists flat; glass on dashboard/login/feature panels | ✓ |
| Glass panels everywhere including tables | Tables/lists also on translucent glass | |

**User's choice:** Flat cards/tables, glass for chrome only

| Option | Description | Selected |
|--------|-------------|----------|
| Stat cards + nav only | Glass stat cards (zeros) + sidebar/header shell | ✓ |
| Minimal placeholder | Sidebar/header shell + welcome message only | |

**User's choice:** Stat cards + nav only

**Additional decision (user-initiated):** User specified shadcn/ui for `/admin` ("in admin panel i want shadcn ui simple"). Follow-up question confirmed scope:

| Option | Description | Selected |
|--------|-------------|----------|
| Admin only | shadcn/ui powers `/admin` CRUD UI; `/frontend` stays fully custom | ✓ |
| Both admin and frontend | shadcn/ui as base for both apps | |

**User's choice:** Admin only — shadcn/ui themed with RSG colors/fonts, used for tables/forms/dialogs/buttons in `/admin`. `/frontend` remains fully custom Tailwind.

**Notes:** "Full Premium Industrial" for admin is reconciled with shadcn/ui by using shadcn as the structural component primitive layer (tables, forms, dialogs) while glassmorphism/gradients apply at the chrome/dashboard/login level (D-04, D-05).

---

## Design System Showcase Page

| Option | Description | Selected |
|--------|-------------|----------|
| Permanent style guide | `/style-guide` route, living reference for later phases | ✓ |
| Throwaway test page | Temporary verification page, deleted before Phase 2 | |

**User's choice:** Permanent style guide

| Option | Description | Selected |
|--------|-------------|----------|
| Tokens + core components | Colors, fonts, gradients, glass, grid + Phase 1 components (buttons, cards, badges, inputs) | ✓ |
| Tokens only | Just colors/fonts/gradients/glass/grid, no components | |

**User's choice:** Tokens + core components

| Option | Description | Selected |
|--------|-------------|----------|
| Dev-only, 404 in production | Route only renders when NODE_ENV !== 'production' | ✓ |
| Public but unlinked | Route exists in production, not in nav | |

**User's choice:** Dev-only, 404 in production

---

## Branding Assets (logo/favicon)

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse existing as placeholder | Use existing rsg-logo.png + favicon, swap later | ✓ |
| Text-based wordmark for now | Styled "RSG" text wordmark instead of image logo | |

**User's choice:** Reuse existing as placeholder

---

## Settings Table Scope for Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| Table + API only | Settings table + GET/PUT API, seeded placeholders; admin UI deferred to Phase 2 | ✓ |
| Table + API + basic Settings UI | Also includes working Settings > General form in Phase 1 | |

**User's choice:** Table + API only

| Option | Description | Selected |
|--------|-------------|----------|
| Contact essentials only | whatsapp_number, business_email, seo_scripts | ✓ |
| Broader set now | Also business_phone, business_address, business_hours, social links | |

**User's choice:** Contact essentials only

---

## Claude's Discretion

- Exact shadcn/ui component selection (which primitives to install) and theming wiring with shared Tailwind config.
- Specific layout/structure of `/style-guide` beyond required sections.

## Deferred Ideas

- Admin Settings > General UI (WhatsApp number, business email editing) — Phase 2, alongside WhatsApp icon feature.
- Additional settings keys (business phone, address, hours, social links) — Phase 2, when Contact page requirements are concrete.

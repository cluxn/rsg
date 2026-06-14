# Phase 2: Public Core Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-14
**Phase:** 2-public-core-pages
**Areas discussed:** Home page sections, Hero background asset, Contact form UX, Admin Settings UI scope

---

## Home Page Sections

| Option | Description | Selected |
|--------|-------------|----------|
| Just the 3 locked ones | Hero + logo strip + testimonials only | |
| Add a 'Why RSG' features grid | 3-4 icon+label USP cards between hero and logos | |
| Add features grid + stats bar | Both a features grid AND a narrow stat bar | |
| Custom (free text) | User directed: "do as senior make proper flow to convert target user, if you dont know then make it like aroma monk" | |
| 6-section conversion flow (Claude recommendation) | Hero → Stats bar → Products teaser → Features grid → Logo strip → Testimonials | ✓ |

**User's choice:** Free text — "do as senior make proper flow to convert target user, if you dont know then make it like aroma monk." Claude proposed 6-section flow; user confirmed "Yes, go with that flow."

**Notes:** User deferred to Claude's judgment on Home page structure. Claude recommended the 6-section B2B conversion flow modeled on aromamonk.com, which was approved.

---

## Hero Background Asset

| Option | Description | Selected |
|--------|-------------|----------|
| Source quality stock photo | High-quality free stock photo of steel manufacturing/roofing from Unsplash/Pexels | ✓ |
| Gradient-only placeholder | Navy→steel-blue→cyan gradient, no photo layer | |
| Use best existing product photo | Best photo from ASSET-INVENTORY.md as hero background | |

**User's choice:** Source quality stock photo (Recommended)

**Follow-up (About page):** User specified About page should mirror current RSG website: company info, CEO/Director bios, Mission/Vision/Values. Claude decided About page hero uses gradient-only background (no photo), and "Our Process" section is skipped due to non-reusable stock icons.

**Notes:** No factory/manufacturing photos exist in ASSET-INVENTORY.md. Researcher will source Unsplash/Pexels stock photo. About page content to be sourced from current rsgprofilesheets.com About page wording.

---

## Contact Form UX

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success message | Form clears, success message appears in place | ✓ |
| Redirect to /thank-you page | Visitor redirected after submit | |
| Toast notification | Toast pops at corner of screen | |

**User's choice:** Inline success message (Recommended)

**Webhook failure handling:**

| Option | Description | Selected |
|--------|-------------|----------|
| Show success anyway — lead is saved to DB | Webhook failure silent; DB is source of truth | ✓ |
| Show a partial success message | Partial acknowledgement message | |
| Show an error and let them retry | Retry button shown | |

**User's choice:** Show success anyway — lead is saved to DB (Recommended)

**Notes:** n8n webhook is supplemental. Admin always sees leads in DB regardless of webhook status.

---

## Admin Settings UI Scope

| Option | Description | Selected |
|--------|-------------|----------|
| WhatsApp + email + address + hours + phone | All contact data the Contact page needs | ✓ |
| WhatsApp + email only | Minimal fields; address/hours/phone hardcoded | |
| All contact fields + social links | Contact info plus Instagram/LinkedIn/Facebook URLs | |

**User's choice:** WhatsApp + email + address + hours + phone (Recommended)

**Data fetching approach:**

| Option | Description | Selected |
|--------|-------------|----------|
| Always fetched from settings API | Contact page calls backend settings endpoint; single source of truth | ✓ |
| Hardcoded defaults, admin overrides optional | Real data hardcoded in component; settings only for WhatsApp | |

**User's choice:** Always fetched from settings API (Recommended)

**Notes:** Social links deferred — not included in Phase 2 Settings UI.

---

## Claude's Discretion

- Exact product categories shown in Home products teaser (4–6 cards)
- Exact wording for "Why RSG" features grid USPs
- Layout/ordering of Contact page sections (form + map arrangement)
- WhatsApp floating icon design (position, size, icon style)
- Footer layout (column structure, social link inclusion)
- Stock photo selection by researcher (search terms: steel roofing manufacturing, metal sheet factory)
- About page hero: gradient-only background (Claude decided, user did not specify)
- "Our Process" skipped: Claude decided based on asset availability

## Deferred Ideas

- Social links (Instagram/LinkedIn/Facebook) in Admin Settings > General — deferred beyond Phase 2
- "Our Process" section on About page — deferred until client can supply real factory photography or custom icons
- /thank-you redirect page for Contact form — deferred to Phase 6 (SEO phase) if GA conversion tracking is needed

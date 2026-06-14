# Pitfalls Research

**Domain:** B2B industrial catalog website + admin CMS (manufacturing/roofing sector)
**Researched:** 2026-06-14
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Hardcoding Configurable Contact Info

**What goes wrong:**
WhatsApp number, business email/phone, and analytics scripts get hardcoded into layout/component code during development "to ship faster," then need a developer to change post-launch.

**Why it happens:**
It's the path of least resistance during early phases when the real values aren't finalized — the placeholder email (`shivam.gupta09@gmail.com`) and missing WhatsApp number make it tempting to inline a literal "for now."

**How to avoid:**
Build the `settings` table and admin Settings screen in Phase 1 (foundation), and read all configurable values (WhatsApp number, contact email/phone, SEO scripts, social links) from it from day one — even before the client supplies final values.

**Warning signs:**
Grep for the placeholder email or a literal phone number string anywhere outside the seed data/migration files.

**Phase to address:**
Phase 1 (Foundation) — settings table + admin Settings screen must exist before WhatsApp icon (Phase 2) or SEO scripts (Phase 6) are built.

---

### Pitfall 2: Letting IndiaMART's Catalog Structure Leak Into the New Site

**What goes wrong:**
IndiaMART (rsgprofilesheets.in) has a different 8-category, per-kg-SKU structure than the current site. During product page implementation it's tempting to "fill gaps" using IndiaMART's richer SKU data, accidentally reshaping the catalog or reintroducing pricing.

**Why it happens:**
IndiaMART has more granular/structured data than the current WordPress site, so it looks like a better source — but SCOPE-DECISIONS.md explicitly locks the current site as the structural source of truth.

**How to avoid:**
When building each of the 10 product pages, reference `.planning/SCOPE-DECISIONS.md` "Product Catalog Structure" and `.planning/research/ASSET-INVENTORY.md` for content/structure. IndiaMART data (BUSINESS-INFO.md) is contact/rating info ONLY.

**Warning signs:**
Any per-kg price, "Brand: TATA/JSW/..." SKU callout, or 8-category grouping appearing in product page content.

**Phase to address:**
Phase 3 (Product Catalog) — review against SCOPE-DECISIONS.md before marking pages complete.

---

### Pitfall 3: ISR Cache Staleness After Admin Edits

**What goes wrong:**
Admin edits a product description or testimonial, saves successfully, but the public page shows old content for the full `revalidate` window (could be hours), making the CMS feel broken during client demos/handover.

**Why it happens:**
ISR's timer-based revalidation is easy to set up but easy to forget to pair with on-demand revalidation triggers from the backend.

**How to avoid:**
Implement `frontend/app/api/revalidate` (secret-protected) in Phase 1, and call it from every admin save handler in `/backend` (products, blog, events, testimonials, home/about content) starting from Phase 2.

**Warning signs:**
"I edited this in the admin but the site still shows the old text" during any manual testing pass.

**Phase to address:**
Phase 1 sets up the endpoint; each content phase (2, 3, 5) wires its save handlers to call it.

---

### Pitfall 4: Low-Resolution Source Images Used at Hero Scale

**What goes wrong:**
Several product categories only have 300x300 WhatsApp-quality photos (per ASSET-INVENTORY.md). Used directly as hero/banner images, they look pixelated and undermine the "Premium Industrial" positioning the entire design system is built around.

**Why it happens:**
Reusing existing assets is faster than sourcing new ones, and the gap between "thumbnail" and "hero" resolution isn't obvious until the page is built.

**How to avoid:**
Establish per-image-role size/quality guidelines in Phase 1 (design system): low-res product photos used only as small thumbnails/cards, never full-width heroes. Use generic high-quality stock/illustration for hero backgrounds (steel/roofing factory imagery) per ASSET-INVENTORY.md recommendation, with real product photos as supporting/detail images.

**Warning signs:**
Any `<Image>` with a source under ~800px wide rendered at hero/banner dimensions.

**Phase to address:**
Phase 1 (design system establishes image-role guidelines), enforced during Phase 2/3 page builds.

---

### Pitfall 5: Admin Script Injection Becomes a Broader XSS Vector

**What goes wrong:**
The SEO > Scripts field is intentionally designed to accept raw `<script>` HTML (for GA/GTM) — if that same "raw HTML" capability is reused elsewhere (e.g. blog post bodies, testimonial text) without sanitization, it becomes an XSS vector for anyone with admin access or a compromised admin account.

**Why it happens:**
Once a "render raw HTML" pattern exists for one admin field, it's tempting to reuse it for rich text fields (blog/testimonials) instead of building a proper sanitized rich-text renderer.

**How to avoid:**
Scope raw-HTML rendering to exactly one designated field (`settings.seo_scripts`), rendered only in `<head>` via `dangerouslySetInnerHTML`. All other rich text (blog posts, testimonials, page copy) goes through Tiptap's sanitized HTML output or a markdown renderer — never raw admin-entered `<script>`.

**Warning signs:**
`dangerouslySetInnerHTML` appearing anywhere outside the single SEO scripts render point.

**Phase to address:**
Phase 6 (SEO & Scripts) — document the single sanitization boundary; Phase 5 (Blog/Testimonials) should already use sanitized rich text.

---

### Pitfall 6: Lead Form Spam Before Notification System Exists

**What goes wrong:**
The Get Quote form and admin Leads list ship in Phase 4, but SMTP/n8n notifications are deliberately last (Phase 7) per SCOPE-DECISIONS.md. Between Phase 4 and Phase 7, the leads list could silently fill with spam submissions that no one sees until much later.

**Why it happens:**
The phase ordering is correct (core functionality before notification "nice to have"), but without basic spam mitigation, the gap creates a real risk of a noisy/unusable leads list by the time notifications matter.

**How to avoid:**
Add a lightweight honeypot field and basic rate-limiting (e.g. per-IP, per-minute) to the Get Quote/Contact form submission endpoint as part of Phase 4 — this is cheap and doesn't require the full notification system to be useful.

**Warning signs:**
Leads list filling with obviously automated/garbage entries during or after Phase 4 testing.

**Phase to address:**
Phase 4 (Lead Capture & Admin Leads).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|---------------------|------------------|--------------------|
| Storing media uploads on local VPS disk instead of object storage | Faster to implement, no extra service to configure | Harder to scale/back up; disk fills if media library grows large | Acceptable for v1 at expected traffic/content volume — revisit only if media volume grows significantly |
| Single `settings` key-value table instead of typed config columns | Avoids migrations for every new configurable field | Less type safety; admin form must validate known keys manually | Acceptable — matches the "configurable post-launch" pattern required by multiple fields (WhatsApp, SEO scripts, contact info) |
| Skipping automated tests for admin CRUD screens initially | Faster initial build | Regressions in admin forms go unnoticed until manual testing | Only acceptable if manual verification (per CLAUDE.md quality gates) covers each admin screen before phase sign-off |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|--------------|------------------|---------------------|
| Google Maps embed | Using the JS Maps API (requires billing-enabled API key) for a simple location pin | Use the basic `<iframe src="https://www.google.com/maps/embed?...">` embed — no API key needed |
| WhatsApp click-to-chat | Hardcoding `wa.me/91XXXXXXXXXX` with the number baked into the component | Read number from `settings` table; render nothing (or hide icon) gracefully if not yet configured |
| SMTP (Phase 7) | Using a personal Gmail account directly for nodemailer (hits Google sending limits/spam filters) | Use a transactional SMTP provider or app-specific credentials the client controls; document setup steps for handover |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|------------------|
| Re-fetching all products on every page via `fetch` without caching | Slow build times, redundant backend calls during ISR revalidation | Use Next.js `fetch` cache options appropriately (`cache: 'force-cache'` with tags, revalidate via `revalidateTag`) | Noticeable once product count + revalidation frequency both grow — unlikely at 10 categories but good practice from the start |
| Serving full-resolution uploaded images directly | Slow page loads, poor Lighthouse LCP scores | `sharp` generates responsive sizes on upload; `next/image` serves correctly sized/WebP images | Immediately visible in Lighthouse — part of CLAUDE.md performance quality gate |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing JWT secret or DB credentials in committed code | Credential leak if repo is ever made public or shared | `.env` files (gitignored) for all secrets, per CLAUDE.md "no hardcoded secrets" rule |
| No rate-limiting on admin login endpoint | Brute-force attacks against the single admin account | Basic rate-limiting/lockout on `/backend/auth/login` |
| Trusting `sourcePage`/`productSlug` from lead form without validation | Could allow injection of arbitrary data into leads table | Validate against known product slugs/page identifiers with zod before insert |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|---------------|--------------------|
| Dense spec tables with no visual hierarchy on product pages | Older B2B audience struggles to scan, may bounce before finding "Get Quote" | Progressive disclosure per SCOPE-DECISIONS.md — lead with use-case/benefit, push detailed specs to a clearly-labeled table/accordion below the fold |
| Multiple competing CTAs per section (Get Quote + WhatsApp + "Learn More" all equally weighted) | Visitor unsure what action to take ("analysis paralysis") | One primary accent-colored CTA per section per SCOPE-DECISIONS.md "Guided Scanning" principle; WhatsApp stays a secondary, consistently-styled floating element |
| Testimonials section feels generic without location/context | Reduces trust impact of real reviews | Always pair reviewer name + city (per BUSINESS-INFO.md sourced quotes), not just a star rating |

## "Looks Done But Isn't" Checklist

- [ ] **Product pages:** Often missing alt text on images — verify every product image has a non-empty alt text set via Media Library before phase sign-off
- [ ] **WhatsApp icon:** Often hardcodes a placeholder number during dev and never gets wired to `settings` — verify it reads from admin config and degrades gracefully when unset
- [ ] **Admin Leads export:** Often exports only visible/filtered rows instead of full dataset, or import doesn't validate required fields — verify both export (all leads) and import (validation + duplicate handling)
- [ ] **SEO scripts field:** Often renders correctly in dev but gets stripped/escaped by a templating layer in production build — verify the injected script actually appears in production HTML `<head>`
- [ ] **ISR revalidation:** Often works for one content type (e.g. products) but is forgotten for others added later (blog, events, testimonials) — verify every admin save handler that affects public pages calls revalidate

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|------------------|-------------------|
| Hardcoded contact info found late | LOW | Move value to `settings` table, seed with current hardcoded value, update component to read from settings/admin |
| Catalog structure drifted toward IndiaMART grouping | MEDIUM | Re-audit affected product pages against SCOPE-DECISIONS.md Product Catalog Structure, restructure content/specs to match current-site-based structure |
| Low-res images used at hero scale discovered during UI review | MEDIUM | Swap in stock/illustration hero background per ASSET-INVENTORY.md recommendation, demote real product photo to detail/card image |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|---------------------|----------------|
| Hardcoding configurable contact info | Phase 1 | Grep for placeholder email/phone literals outside seed/migration files |
| IndiaMART structure leakage | Phase 3 | Manual review of each product page against SCOPE-DECISIONS.md before sign-off |
| ISR cache staleness | Phase 1 (endpoint), Phases 2/3/5 (wiring) | Manually edit content in admin, confirm public page reflects change within seconds |
| Low-res hero images | Phase 1 (guidelines), Phases 2/3 (build) | Visual review of all hero sections against image-role guidelines |
| Script injection scope creep | Phase 5/6 | Grep for `dangerouslySetInnerHTML` — only one occurrence (SEO scripts render point) |
| Lead form spam | Phase 4 | Submit form rapidly in testing, confirm rate-limit/honeypot triggers |

## Sources

- `.planning/PROJECT.md`, `.planning/SCOPE-DECISIONS.md` — locked decisions that pitfalls map against
- `.planning/research/ASSET-INVENTORY.md` — known image-quality gaps
- `.planning/research/BUSINESS-INFO.md` — IndiaMART vs. current-site structure distinction
- General Next.js/Express/MySQL production gotchas (ISR revalidation, image optimization, JWT auth hardening)

---
*Pitfalls research for: B2B industrial catalog + admin CMS*
*Researched: 2026-06-14*

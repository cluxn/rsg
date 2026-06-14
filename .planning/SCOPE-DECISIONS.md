# Scope Decisions Log

Running log of confirmed scope decisions for the RSG website (public site + admin panel). Feed these into REQUIREMENTS.md / ROADMAP.md when the project is formally initialized.

## Public Site

- **Client logos**: homepage/about section only, populated based on target audience. NOT a standalone page. Source images from RSG's current site (rsgprofilesheets.com — e.g. tata-steel-logo.png and other partner/client logos already uploaded there) rather than requesting new assets from client.
- **Relevant blog links on product pages**: section-based, chosen per target audience. NOT a standalone linking system.
- **Case studies**: NO case study page. Confirmed out of scope — do not reintroduce.
- **Newsletter**: NO newsletter signup anywhere on the site or admin.
- **WhatsApp**: floating WhatsApp icon on all pages for direct contact (in addition to/alongside the Get Quote form). Do NOT hardcode/pre-configure a phone number — build the component so the number is set via an admin/config field, and the client will enter their own number after launch.
- **Contact page / footer info**: until the client provides their official business email, show `shivam.gupta09@gmail.com` as a placeholder/fallback (see `.planning/research/BUSINESS-INFO.md`). Address, hours, and other business details sourced from IndiaMART/Google (see BUSINESS-INFO.md) may be used for Contact page text — but IndiaMART is for business/contact-detail reference ONLY, not for site structure or product catalog (see Product Catalog decision below).
- **Analytics**: NO built-in analytics dashboard/tracking in v1. Analytics script (e.g. GA4/GTM) will be pasted into the admin's SEO > Scripts field by the admin AFTER the site goes live — site must support arbitrary `<script>` injection via admin, but ships with none configured.
- **Testimonials / social proof**: replace stock-photo testimonials from current site with REAL Google review quotes (Google 4.7/5, 19 reviews — e.g. Shivkant Dixit, Arvind Yadav) and IndiaMART/Justdial ratings. Add a "Reviews/Testimonials" section (homepage + About) showing aggregate rating badges (Google 4.7★, IndiaMART ~4.0★, Justdial 4.3★) plus 3-4 real review quotes (name + city, no photo needed). Admin should be able to add/edit testimonials (text, name, city, rating, source) — see `.planning/research/BUSINESS-INFO.md` for sourced quotes. Builds trust/credibility for B2B buyers without needing client-supplied photos.
- **Footer credit**: footer must include "Developed and managed by **Buildera Technologies LLP**" with a do-follow hyperlink to https://buildera.co/ (no `rel="nofollow"`/`rel="sponsored"` on this link).
- **Pricing**: NO public pricing anywhere on the site — "Get Quote" only (locked decision; do not show IndiaMART-style per-kg pricing).
- **About page — leadership bios**: use the CURRENT WEBSITE's wording for Shivam Gupta (CEO) and Raman Kumar Gupta (Director) as-is for the new About page — do NOT use IndiaMART's "Director" title for Shivam Gupta. Old site is the source of truth for About page content.

## Product Catalog Structure

Source of truth = current website (rsgprofilesheets.com) structure. IndiaMART (rsgprofilesheets.in) was scraped ONLY for business/contact details (address, phone, ratings, etc. — see BUSINESS-INFO.md) and must NOT be used to reshape the product catalog — its 8-category grouping with per-kg SKUs is a different (commodity-marketplace) presentation and would create confusion if mixed in.

- **10 product pages total** (confirmed):
  1. Colour Coated Roofing Sheet
  2. MS Plate/Channel/Angle
  3. MS Pipe
  4. Decking Sheet
  5. Purlins
  6. Polycarbonate Sheet
  7. Crimping Sheet
  8. **Self Drilling Screws** — gets its OWN dedicated page (split out from the old site's shared "Accessories" page), matching how the other categories above each have their own page.
  9. **Turbo Air Ventilator** — gets its OWN dedicated page (same reasoning as Self Drilling Screws).
  10. **Accessories** (new 10th page) — covers the remaining items from the old "Accessories" page that aren't separate product lines: Corner Accessories, AZ-70 Coated Plain Ridge Cover, Metal Roof Flashing, D-style Gutter Box. Mirrors how the old site grouped these together.

## Admin Panel

- **Media Library**: every media item must have an editable **alt text** field (accessibility + SEO).
- **Lead notifications**: SMTP email and/or n8n webhook notification on new lead/quote submission — **build last**, after core site/admin is functional.
- **Leads section simplified**: NO Meetings, NO Newsletter, NO pipeline stages (drop the New/Contacted/Meeting/Converted/Closed/Lost/Junk/Follow-up funnel). Leads = a flat list of submissions with source tracking + export/import only.

## Design Direction — "Premium Industrial"

Client wants visual richness (gradients, glassmorphism, photography-led), similar to aromamonk.com and their current site — a flat/minimal 2-color design was rejected as not matching target audience expectations (signals "small/unfinished" to Indian B2B manufacturing buyers).

- **Hero sections**: full-width product/factory photography with gradient overlay (navy → steel-blue → soft cyan, diagonal) — no purple gradients.
- **Glassmorphism**: "Get Quote" form and key stat/feature cards sit on frosted/translucent glass panels over hero imagery (like Aroma Monk's hero form-over-image).
- **Accent color**: one warm tone (burnt orange `#E8590C` or red `#C0392B`, pulled from RSG badge) for CTAs/badges/icons — keeps the rich design from becoming a color free-for-all.
- **Imagery**: large real photos — product close-ups, factory/installation shots, "Our Process" step photography.
- **Cards**: icon + image feature cards, soft shadows, 10-12px rounded corners — more dimensional than flat minimal.
- **Fonts**: Sora (headings) + Source Sans 3 (body).
- **Client logos / partner logos**: source from rsgprofilesheets.com existing uploads (tata-steel-logo.png, etc.) — no new asset requests needed for this section. For any logo image that isn't clear/usable (e.g. the "Untitled-design-XX.png" files of unclear origin), identify the company and source that company's official logo via Google image search instead of using the low-quality original.
- **Layout/whitespace (big B2B brand feel)**:
  - Page content never touches viewport edges — consistent horizontal gutter/margin (e.g. max-width container ~1280-1320px, centered, with min 24px mobile / 64-80px desktop side padding).
  - Generous vertical spacing BETWEEN sections (96-128px desktop, 48-64px mobile) so each section reads as a distinct block, not crammed.
  - Generous spacing WITHIN sections too (headings to body, cards to cards) — avoid dense/cramped layouts even with image-heavy design.
- **Color comfort**: avoid harsh/neon/over-saturated colors and high-glare pure-white backgrounds — use soft off-white surfaces, muted/desaturated gradient tones, and sufficient contrast without being eye-straining (especially important for longer reading of specs/blog content).
- **Color psychology / rhythm**: steel-blue/navy (dominant) communicates trust, stability, engineering precision — fits a manufacturer. Orange/red (accent) is its psychological complement — signals energy, urgency, action — used specifically to drive attention to CTAs ("Get Quote", WhatsApp, key stats/highlights). The two are deliberately complementary so the accent "pops" against the calm base instead of clashing or blending in.
  - Dominant (60-70%): off-white/neutral surfaces — keeps the site calm and premium, not loud.
  - Secondary (20-30%): navy/steel-blue gradient family — headings, nav, hero overlays, icons — carries the "trustworthy industrial" tone.
  - Accent (5-10%): orange/red — reserved for CTAs, badges, key numbers/highlights — gives the site energy without overwhelming it.
  - Rule of thumb: every section should have ONE clear focal point using the accent color; if a section feels dull, it's missing that focal point — not missing more colors.
- **Font sizing (readability for B2B/factory-owner audience, likely older demographic)**:
  - Body text minimum 16-18px (not 14px default), line-height ~1.6-1.8 for paragraphs.
  - Headings sized clearly larger than body with strong hierarchy — no tiny captions/labels under ~14px.
  - Spec tables and form labels also kept legible (min 15-16px), not shrunk to fit.

## UX Principle — Guided Scanning, Not Thinking

The site must make it obvious, at every section, what to look at and what to do next — user shouldn't have to "figure out" the page.

- **Clear visual hierarchy per section**: one dominant element (headline, hero image, key stat, or CTA) that the eye lands on first — established via size, the accent color, and whitespace (not competing equally-weighted elements).
- **F/Z-pattern scanning**: structure content so eyes naturally flow toward the next logical block and ultimately toward a CTA (Get Quote / WhatsApp / Download Guide).
- **One primary action per section**: every major section should have an obvious next step (a button, a link, a form) — don't leave users to wonder "ok, now what?"
- **Consistent CTA styling**: the accent-color button always means the same kind of action (lead conversion), so users recognize it instantly without reading.
- **Progressive disclosure**: lead with the most important info (what product, why it matters, how to act), push deep specs/details below the fold or behind tabs/accordions — don't front-load dense technical tables.
- **Scannable content blocks**: short headlines, icon+label feature grids, bulleted specs, bolded key terms — minimize long unbroken paragraphs, especially on product pages.

## Updated Page List Deltas (vs. earlier full list)

- Remove: standalone "Client Logos" page
- Remove: any "Case Studies" page (was never formally added, but explicitly confirmed excluded)
- Remove: Newsletter signups from admin Leads section
- Remove: Meetings and pipeline-stage funnel from admin Leads section
- Add: WhatsApp floating contact icon (global, not a page — site-wide component), number configured by client post-launch
- Add: 10th product page "Accessories" (Corner Accessories, AZ-70 Ridge Cover, Metal Roof Flashing, D-style Gutter Box) — see Product Catalog Structure section
- Confirm: Self Drilling Screws and Turbo Air Ventilator are each full product pages (not bundled into Accessories)

# RSG Asset & Content Inventory (from rsgprofilesheets.com)

Source: scraped pages in `.planning/research/raw/.firecrawl/`. Client will NOT provide new images — design must source/reuse from current site (real product photos) and fall back to stock/illustration where current assets are missing or stock-template-only.

## Product Pages (10 categories — see SCOPE-DECISIONS.md "Product Catalog Structure")

| Category | Current images | Image quality | Copy quality | Notes |
|---|---|---|---|---|
| Colour Coated Roofing Sheet | 1 (WhatsApp photo, 300x300) | Low-res, usable as thumbnail only | Thin — materials list only (GI, Galvalume, Aluminium-Zinc, PPGI, PPGL) | Needs hero-quality photo + expanded copy (uses, specs table) |
| MS Plate/Channel/Angle | 1 (WhatsApp photo, 300x300) | Low-res | Good — has size/thickness specs per sub-type (Plate/Channel/Angle) | Specs ready to use in a table |
| Self Drilling Screws | 1 (WhatsApp photo, 300x300, from Accessories page) | Low-res | Good short copy | Currently bundled in "Accessories" page — needs its own page |
| MS Pipe | 2 (WhatsApp photos, full-size) | Decent | Strong — Seamless vs Semi-Seamless explained, properties table, manufacturing process steps | Good content base, process steps could become "Our Process" visual |
| Decking Sheet | 2 (WhatsApp photos, one 300x152) | Mixed | Good — uses + key features lists | Usable |
| Turbo Air Ventilator | 1 (WhatsApp photo, 300x300, from Accessories page) | Low-res | Good short copy | Currently bundled in "Accessories" page — needs its own page |
| Purlins | 2 (WhatsApp photos, full-size) | Decent | Thin — one paragraph | Needs expanded copy (C/Z sizes, spans, load tables) |
| Polycarbonate Sheet | 2 (one 1024x768 high-res) | Good | Strong — types (solid/multiwall/corrugated), uses, features | Best-documented product, good template for others |
| Crimping Sheet | 1 (300x300, low-res .jpg) | Low-res | Short but adequate | Needs better photo |

## 10th page: Accessories

The current "Accessories" page also covers: **Corner Accessories**, **AZ-70 Coated Plain Ridge Cover**, **Metal Roof Flashing**, **D-style Gutter Box** — each with real photos + decent copy. CONFIRMED: these become the new 10th "Accessories" product page (Self Drilling Screws and Turbo Air Ventilator are split out into their own dedicated pages instead, per SCOPE-DECISIONS.md).

## About Page

- Strong company narrative: founded 2019, Dada Nagar Kanpur, "RSG Profile Manufacturing Pvt. Ltd."
- Leadership quotes with REAL photos: CEO Mr. Shivam Gupta, Director Mr. Raman Kumar Gupta (2 portrait photos, decent res)
- "Our Process" section uses generic stock icons/illustrations from a WordPress theme (themedox.com/roofx) — NOT reusable, need custom icons or real factory photos
- 3 testimonials (Ramesh Tirpathi, Umesh Sharma, Sahil Kumar — all "Roofing Retailer") but photos attached (durashine-banner3.jpg, banner3.jpg, ecobuild-why-banner.jpg) are generic stock banners, not real customer photos — use as text-only testimonials or pair with initials/avatar placeholders
- Client/partner logo strip: mix of `tata-steel-logo.png` (real, usable) + several "Untitled-design-XX.png" graphics of unclear origin + WhatsApp photos misplaced in the logo carousel — needs cleanup, but `tata-steel-logo.png` is confirmed usable per client direction

## Contact Page

- Essentially empty: just a contact form + Google Maps embed, no visible address/phone/email text in scrape
- **Resolved**: address, hours, and a fallback email now sourced via IndiaMART/Google (see `.planning/research/BUSINESS-INFO.md`) — for business details only, not product structure. WhatsApp number will NOT be pre-filled; client adds it post-launch (see SCOPE-DECISIONS.md).

## Brand Assets

- `rsg-logo.png` downloaded — busy stock-template logo (sun + colorful roof triangles + red "RSG" badge), treated as placeholder per design direction discussion, not a strict color anchor
- Favicon exists at rsgprofilesheets.com (cropped-cropped-RSG-Site-Icon)

## Summary / Next Steps

- Usable real product photography exists for all 9 categories (quality varies — Polycarbonate and MS Pipe are best, Colour Coated Roofing Sheet/Crimping Sheet/SDS/Turbo Ventilator are weakest at 300x300)
- About page leadership photos are usable as-is
- Testimonial photos and "Our Process" icons need replacing (stock/template, not real) — design should use icon sets or illustration instead
- Missing: real factory/manufacturing floor photos (would strengthen "Premium Industrial" hero imagery) — not present anywhere on current site; may need to source generic high-quality steel/roofing stock photography for hero backgrounds since client won't provide new images
- Open question for client: phone/WhatsApp number + address (not found via scraping)

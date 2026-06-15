-- Remove product pages not reachable from the public nav (SiteHeader.tsx).
-- Per SCOPE-DECISIONS.md "Product Catalog Structure": Self Drilling Screws and
-- Turbo Air Ventilator were unlinked dead-ends, not present anywhere in the
-- old site's mega-menu. Client confirmed they should be fully removed.
-- product_media rows for these products cascade-delete via FK ON DELETE CASCADE.

DELETE FROM products WHERE slug IN ('self-drilling-screws', 'turbo-air-ventilator');

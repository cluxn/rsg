import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';

interface ProductListItem { id: number; slug: string; name: string; display_order: number }

// Mirrors the public-site hierarchy in frontend/components/layout/SiteHeader.tsx
const CCRS_SLUG = 'colour-coated-roofing-sheet';
const ACCESSORIES_SLUG = 'accessories';
const PPGL_VARIANT_SLUGS = ['jsw-colouron', 'jsw-silveron', 'jsw-pragati', 'jsw-endura', 'tata-durashine', 'jindal-sabrang'];
const PPGI_VARIANT_SLUGS = ['dura-glow', 'am-ns'];

const byOrder = (a: ProductListItem, b: ProductListItem) => a.display_order - b.display_order;

function ProductRow({ p, indent }: { p: ProductListItem; indent?: boolean }) {
  return (
    <Link
      to={`/catalog/${p.slug}`}
      className={`flex items-center justify-between p-4 rounded-xl border border-navy/10 bg-white hover:border-steel/40 hover:shadow-sm transition-all ${indent ? 'ml-6' : ''}`}
    >
      <div className="flex items-center gap-4">
        <span className="font-body text-navy/30 text-sm w-6 text-right">{p.display_order}</span>
        <span className="font-heading text-navy text-base font-medium">{p.name}</span>
      </div>
      <div className="flex items-center gap-2 text-steel font-body text-sm">
        Edit <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

export function CatalogPage() {
  const { data: products = [], isLoading } = useQuery<ProductListItem[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data),
  });

  const mainProduct = products.find(p => p.slug === CCRS_SLUG);
  const accessories = products.find(p => p.slug === ACCESSORIES_SLUG);
  const ppglVariants = products.filter(p => PPGL_VARIANT_SLUGS.includes(p.slug)).sort(byOrder);
  const ppgiVariants = products.filter(p => PPGI_VARIANT_SLUGS.includes(p.slug)).sort(byOrder);

  const ccrsGroupSlugs = new Set([CCRS_SLUG, ACCESSORIES_SLUG, ...PPGL_VARIANT_SLUGS, ...PPGI_VARIANT_SLUGS]);
  const otherCategories = products.filter(p => !ccrsGroupSlugs.has(p.slug)).sort(byOrder);

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-heading text-2xl text-navy mb-2">Product Catalog</h1>
        <p className="font-body text-navy/60 text-sm mb-6">
          Click a product to edit its description, specifications, and images.
        </p>
        {isLoading ? (
          <div className="text-navy/40 font-body py-8 text-center">Loading products…</div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="font-heading text-navy text-lg font-semibold mb-3">Colour Coated Roofing Sheet</h2>
              <div className="space-y-2">
                {mainProduct && <ProductRow p={mainProduct} />}

                {ppglVariants.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="font-body text-navy/40 text-xs uppercase tracking-widest ml-6">PPGL Variants</p>
                    {ppglVariants.map(p => <ProductRow key={p.slug} p={p} indent />)}
                  </div>
                )}

                {ppgiVariants.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="font-body text-navy/40 text-xs uppercase tracking-widest ml-6">PPGI Variants</p>
                    {ppgiVariants.map(p => <ProductRow key={p.slug} p={p} indent />)}
                  </div>
                )}

                {accessories && (
                  <div className="pt-2">
                    <ProductRow p={accessories} indent />
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-navy text-lg font-semibold mb-3">Other Product Categories</h2>
              <div className="space-y-2">
                {otherCategories.map(p => <ProductRow key={p.slug} p={p} />)}
              </div>
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

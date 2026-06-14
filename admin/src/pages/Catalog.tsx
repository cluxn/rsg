import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';

interface ProductListItem { id: number; slug: string; name: string; display_order: number }

export function CatalogPage() {
  const { data: products = [], isLoading } = useQuery<ProductListItem[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data),
  });

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
          <div className="space-y-2">
            {products.map(p => (
              <Link
                key={p.slug}
                to={`/catalog/${p.slug}`}
                className="flex items-center justify-between p-4 rounded-xl border border-navy/10 bg-white hover:border-steel/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="font-body text-navy/30 text-sm w-6 text-right">{p.display_order}</span>
                  <span className="font-heading text-navy text-base font-medium">{p.name}</span>
                </div>
                <div className="flex items-center gap-2 text-steel font-body text-sm">
                  Edit <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

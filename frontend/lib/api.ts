import { STATIC_SETTINGS, STATIC_PRODUCTS, STATIC_PRODUCT_DETAILS } from './static-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function report404(url: string): void {
  const endpoint = `${API_BASE}/api/404-logs`;
  const body = JSON.stringify({ url });
  // sendBeacon is fire-and-forget and not intercepted by fetch wrappers
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      next: { revalidate: 3600, tags: ['settings'] },
    });
    if (!res.ok) return STATIC_SETTINGS;
    return res.json();
  } catch { return STATIC_SETTINGS; }
}

export type ProductMedia = { id: number; url: string; alt_text: string; display_order: number };
export type ProductSpec = { label: string; value: string };
export type ProductSummary = { id: number; slug: string; name: string; display_order: number };
export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  specs: ProductSpec[] | null;
  media: ProductMedia[];
};

export async function getProducts(): Promise<ProductSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return STATIC_PRODUCTS;
    return res.json();
  } catch { return STATIC_PRODUCTS; }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${slug}`, {
      next: { revalidate: 3600, tags: [`product-${slug}`] },
    });
    if (!res.ok) return STATIC_PRODUCT_DETAILS[slug] ?? null;
    return res.json();
  } catch { return STATIC_PRODUCT_DETAILS[slug] ?? null; }
}

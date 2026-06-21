const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function report404(url: string): void {
  fetch(`${API_BASE}/api/404-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}

export async function getSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    next: { revalidate: 3600, tags: ['settings'] },
  });
  if (!res.ok) throw new Error(`getSettings failed: ${res.status}`);
  return res.json();
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
  const res = await fetch(`${API_BASE}/api/products`, {
    next: { revalidate: 3600, tags: ['products'] },
  });
  if (!res.ok) throw new Error(`getProducts failed: ${res.status}`);
  return res.json();
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/api/products/${slug}`, {
    next: { revalidate: 3600, tags: [`product-${slug}`] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getProduct failed: ${res.status}`);
  return res.json();
}

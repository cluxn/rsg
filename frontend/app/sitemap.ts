import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { getBlogPosts } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rsgprofilesheets.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.allSettled([
    getProducts(),
    getBlogPosts(),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.status === 'fulfilled'
    ? products.value.map(p => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    : [];

  const blogEntries: MetadataRoute.Sitemap = posts.status === 'fulfilled'
    ? posts.value.map(p => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.published_at ?? p.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    : [];

  return [
    { url: `${BASE_URL}/`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/events`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    ...productEntries,
    ...blogEntries,
  ];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface BlogListItem {
  id: number;
  slug: string;
  title: string;
  meta_description?: string;
  published_at: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
  published_at: string;
  created_at: string;
}

export interface EventItem {
  id: number;
  slug: string;
  title: string;
  body: string;
  event_date?: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author_name: string;
  author_city?: string;
  rating?: number;
  source: 'google' | 'indiamart' | 'justdial' | 'other';
}

export async function getBlogPosts(): Promise<BlogListItem[]> {
  const res = await fetch(`${API_URL}/api/blog`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/blog/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_URL}/api/events`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API_URL}/api/testimonials`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

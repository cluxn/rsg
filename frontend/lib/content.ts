const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type ContentStatus = 'draft' | 'scheduled' | 'published';

export const BLOG_COVER_PLACEHOLDER = '/images/blog-placeholder.svg';
export const EVENT_COVER_PLACEHOLDER = '/images/event-placeholder.svg';

export interface BlogListItem {
  id: number;
  slug: string;
  title: string;
  category?: string;
  service?: string;
  industry?: string;
  excerpt?: string;
  featured_image?: string;
  author_name?: string;
  featured: boolean;
  status: ContentStatus;
  meta_description?: string;
  published_at: string | null;
  created_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category?: string;
  service?: string;
  industry?: string;
  excerpt?: string;
  featured_image?: string;
  author_name?: string;
  featured: boolean;
  body: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
}

export interface EventItem {
  id: number;
  slug: string;
  title: string;
  event_type?: string;
  location?: string;
  excerpt?: string;
  cover_image?: string;
  body: string;
  event_date?: string;
  end_date?: string;
  featured: boolean;
  status: ContentStatus;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  show_sidebar_form: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author_name: string;
  author_city?: string;
  author_image?: string;
  company?: string;
  designation?: string;
  product_bought?: string;
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

export async function getEvent(slug: string): Promise<EventItem | null> {
  const res = await fetch(`${API_URL}/api/events/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getTestimonials(page?: 'home' | 'about'): Promise<Testimonial[]> {
  const qs = page ? `?page=${page}` : '';
  const res = await fetch(`${API_URL}/api/testimonials${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

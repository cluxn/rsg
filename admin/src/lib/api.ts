import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
}

export interface EventRecord {
  id: number;
  slug: string;
  title: string;
  body: string;
  event_date?: string;
  published: boolean;
  created_at: string;
}

export interface CreateEventInput {
  title: string;
  slug: string;
  body: string;
  event_date?: string;
  published: boolean;
}

export interface Testimonial {
  id: number;
  text: string;
  author_name: string;
  author_city?: string;
  rating?: number;
  source: 'google' | 'indiamart' | 'justdial' | 'other';
  active: boolean;
  created_at: string;
}

export interface CreateTestimonialInput {
  text: string;
  author_name: string;
  author_city?: string;
  rating?: number;
  source: 'google' | 'indiamart' | 'justdial' | 'other';
  active: boolean;
}

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const getBlogPostsAdmin = () => api.get<BlogPost[]>('/blog/admin/all').then(r => r.data);
export const createBlogPost = (data: CreateBlogPostInput) => api.post('/blog', data).then(r => r.data);
export const updateBlogPost = (id: number, data: Partial<CreateBlogPostInput>) => api.put(`/blog/${id}`, data).then(r => r.data);
export const deleteBlogPost = (id: number) => api.delete(`/blog/${id}`).then(r => r.data);

// ─── Events ───────────────────────────────────────────────────────────────────

export const getEventsAdmin = () => api.get<EventRecord[]>('/events/admin/all').then(r => r.data);
export const createEvent = (data: CreateEventInput) => api.post('/events', data).then(r => r.data);
export const updateEvent = (id: number, data: Partial<CreateEventInput>) => api.put(`/events/${id}`, data).then(r => r.data);
export const deleteEvent = (id: number) => api.delete(`/events/${id}`).then(r => r.data);

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getTestimonialsAdmin = () => api.get<Testimonial[]>('/testimonials/admin/all').then(r => r.data);
export const createTestimonial = (data: CreateTestimonialInput) => api.post('/testimonials', data).then(r => r.data);
export const updateTestimonial = (id: number, data: Partial<CreateTestimonialInput>) => api.put(`/testimonials/${id}`, data).then(r => r.data);
export const deleteTestimonial = (id: number) => api.delete(`/testimonials/${id}`).then(r => r.data);

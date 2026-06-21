import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'scheduled' | 'published';

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
  published: boolean;
  status: ContentStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  body: string;
  category?: string;
  service?: string;
  industry?: string;
  excerpt?: string;
  featured_image?: string;
  author_name?: string;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  status: ContentStatus;
  scheduled_at?: string | null;
}

export interface EventRecord {
  id: number;
  slug: string;
  title: string;
  body: string;
  event_type?: string;
  location?: string;
  excerpt?: string;
  cover_image?: string;
  event_date?: string;
  end_date?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  show_sidebar_form: boolean;
  featured: boolean;
  published: boolean;
  status: ContentStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
}

export interface CreateEventInput {
  title: string;
  slug: string;
  body: string;
  event_type?: string;
  location?: string;
  excerpt?: string;
  cover_image?: string;
  event_date?: string;
  end_date?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  show_sidebar_form?: boolean;
  featured?: boolean;
  status: ContentStatus;
  scheduled_at?: string | null;
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
  active: boolean;
  show_on_home: boolean;
  show_on_about: boolean;
  created_at: string;
}

export interface CreateTestimonialInput {
  text: string;
  author_name: string;
  author_city?: string;
  author_image?: string;
  company?: string;
  designation?: string;
  product_bought?: string;
  rating?: number;
  source: 'google' | 'indiamart' | 'justdial' | 'other';
  active: boolean;
  show_on_home?: boolean;
  show_on_about?: boolean;
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

// ─── Case Studies ─────────────────────────────────────────────────────────────

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  client_name: string | null;
  industry: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyInput {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  client_name?: string;
  industry?: string;
  published: boolean;
}

export const getCaseStudiesAdmin = () => api.get<CaseStudy[]>('/case-studies/admin/all').then(r => r.data);
export const createCaseStudy = (data: CaseStudyInput) => api.post('/case-studies', data).then(r => r.data);
export const updateCaseStudy = (id: number, data: Partial<CaseStudyInput>) => api.put(`/case-studies/${id}`, data).then(r => r.data);
export const deleteCaseStudy = (id: number) => api.delete(`/case-studies/${id}`).then(r => r.data);

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getTestimonialsAdmin = () => api.get<Testimonial[]>('/testimonials/admin/all').then(r => r.data);
export const createTestimonial = (data: CreateTestimonialInput) => api.post('/testimonials', data).then(r => r.data);
export const updateTestimonial = (id: number, data: Partial<CreateTestimonialInput>) => api.put(`/testimonials/${id}`, data).then(r => r.data);
export const deleteTestimonial = (id: number) => api.delete(`/testimonials/${id}`).then(r => r.data);

// ─── Client Logos ─────────────────────────────────────────────────────────────

export interface ClientLogo {
  id: number;
  name: string;
  industry: string | null;
  logo_url: string | null;
  visible: boolean;
  display_order: number;
  created_at: string;
}

export interface ClientLogoInput {
  name: string;
  industry?: string;
  logo_url?: string;
  visible?: boolean;
  display_order?: number;
}

export const getClientLogosAdmin = () => api.get<ClientLogo[]>('/client-logos/admin/all').then(r => r.data);
export const createClientLogo = (data: ClientLogoInput) => api.post('/client-logos', data).then(r => r.data);
export const updateClientLogo = (id: number, data: Partial<ClientLogoInput>) => api.put(`/client-logos/${id}`, data).then(r => r.data);
export const deleteClientLogo = (id: number) => api.delete(`/client-logos/${id}`).then(r => r.data);
export const reorderClientLogos = (ids: number[]) => api.post('/client-logos/reorder', { ids }).then(r => r.data);

// ─── Authors ──────────────────────────────────────────────────────────────────

export interface Author {
  id: number;
  name: string;
  email: string | null;
  photo_url: string | null;
  role: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface AuthorInput {
  name: string;
  email?: string;
  photo_url?: string;
  role?: string;
  active?: boolean;
  display_order?: number;
}

export const getAuthorsAdmin = () => api.get<Author[]>('/authors/admin/all').then(r => r.data);
export const createAuthor = (data: AuthorInput) => api.post('/authors', data).then(r => r.data);
export const updateAuthor = (id: number, data: Partial<AuthorInput>) => api.put(`/authors/${id}`, data).then(r => r.data);
export const deleteAuthor = (id: number) => api.delete(`/authors/${id}`).then(r => r.data);

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  type: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

export interface CategoryInput {
  type?: string;
  name: string;
  slug: string;
}

export const getCategoriesAdmin = () => api.get<Category[]>('/categories/admin/all').then(r => r.data);
export const createCategory = (data: CategoryInput) => api.post('/categories', data).then(r => r.data);
export const updateCategory = (id: number, data: { name?: string; slug?: string }) => api.put(`/categories/${id}`, data).then(r => r.data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`).then(r => r.data);

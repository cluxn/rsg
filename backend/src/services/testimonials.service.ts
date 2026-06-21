import { query, pool } from '../db/connection';

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

export interface CreateTestimonialData {
  text: string;
  author_name: string;
  author_city?: string;
  author_image?: string;
  company?: string;
  designation?: string;
  product_bought?: string;
  rating?: number;
  source?: string;
  active?: boolean;
  show_on_home?: boolean;
  show_on_about?: boolean;
}

export async function listActiveTestimonials(page?: 'home' | 'about'): Promise<Omit<Testimonial, 'active'>[]> {
  const pageFilter = page === 'home' ? 'AND show_on_home = TRUE' : page === 'about' ? 'AND show_on_about = TRUE' : '';
  return query(
    `SELECT id, text, author_name, author_city, author_image, company, designation, product_bought, rating, source, show_on_home, show_on_about
     FROM testimonials WHERE active = TRUE ${pageFilter} ORDER BY created_at DESC`
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return query('SELECT * FROM testimonials ORDER BY created_at DESC');
}

export async function createTestimonial(data: CreateTestimonialData): Promise<{ insertId: number }> {
  const { text, author_name, author_city, author_image, company, designation, product_bought, rating, source = 'google', active = true, show_on_home = false, show_on_about = false } = data;
  const [result] = await pool.execute(
    'INSERT INTO testimonials (text, author_name, author_city, author_image, company, designation, product_bought, rating, source, active, show_on_home, show_on_about) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [text, author_name, author_city ?? null, author_image ?? null, company ?? null, designation ?? null, product_bought ?? null, rating ?? null, source, active, show_on_home, show_on_about]
  ) as [{ insertId: number }, unknown];
  return result;
}

export async function updateTestimonial(id: number, data: Partial<CreateTestimonialData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.text !== undefined) { fields.push('text = ?'); params.push(data.text); }
  if (data.author_name !== undefined) { fields.push('author_name = ?'); params.push(data.author_name); }
  if (data.author_city !== undefined) { fields.push('author_city = ?'); params.push(data.author_city); }
  if (data.author_image !== undefined) { fields.push('author_image = ?'); params.push(data.author_image); }
  if (data.company !== undefined) { fields.push('company = ?'); params.push(data.company); }
  if (data.designation !== undefined) { fields.push('designation = ?'); params.push(data.designation); }
  if (data.product_bought !== undefined) { fields.push('product_bought = ?'); params.push(data.product_bought); }
  if (data.rating !== undefined) { fields.push('rating = ?'); params.push(data.rating); }
  if (data.source !== undefined) { fields.push('source = ?'); params.push(data.source); }
  if (data.active !== undefined) { fields.push('active = ?'); params.push(data.active); }
  if (data.show_on_home !== undefined) { fields.push('show_on_home = ?'); params.push(data.show_on_home); }
  if (data.show_on_about !== undefined) { fields.push('show_on_about = ?'); params.push(data.show_on_about); }
  params.push(id);

  await query(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteTestimonial(id: number): Promise<void> {
  await query('DELETE FROM testimonials WHERE id = ?', [id]);
}

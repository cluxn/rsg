import { query } from '../db/connection';

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

export interface CreateTestimonialData {
  text: string;
  author_name: string;
  author_city?: string;
  rating?: number;
  source?: string;
  active?: boolean;
}

export async function listActiveTestimonials(): Promise<Omit<Testimonial, 'active'>[]> {
  return query(
    'SELECT id, text, author_name, author_city, rating, source FROM testimonials WHERE active = TRUE ORDER BY created_at DESC'
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return query('SELECT * FROM testimonials ORDER BY created_at DESC');
}

export async function createTestimonial(data: CreateTestimonialData): Promise<{ insertId: number }> {
  const { text, author_name, author_city, rating, source = 'google', active = true } = data;
  const rows = await query<{ insertId: number }>(
    'INSERT INTO testimonials (text, author_name, author_city, rating, source, active) VALUES (?, ?, ?, ?, ?, ?)',
    [text, author_name, author_city ?? null, rating ?? null, source, active]
  );
  return rows[0];
}

export async function updateTestimonial(id: number, data: Partial<CreateTestimonialData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.text !== undefined) { fields.push('text = ?'); params.push(data.text); }
  if (data.author_name !== undefined) { fields.push('author_name = ?'); params.push(data.author_name); }
  if (data.author_city !== undefined) { fields.push('author_city = ?'); params.push(data.author_city); }
  if (data.rating !== undefined) { fields.push('rating = ?'); params.push(data.rating); }
  if (data.source !== undefined) { fields.push('source = ?'); params.push(data.source); }
  if (data.active !== undefined) { fields.push('active = ?'); params.push(data.active); }
  params.push(id);

  await query(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteTestimonial(id: number): Promise<void> {
  await query('DELETE FROM testimonials WHERE id = ?', [id]);
}

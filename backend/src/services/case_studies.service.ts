import { query } from '../db/connection';

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

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return query<CaseStudy>(
    'SELECT * FROM case_studies ORDER BY created_at DESC'
  );
}

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  return query<CaseStudy>(
    'SELECT * FROM case_studies WHERE published = TRUE ORDER BY published_at DESC'
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const rows = await query<CaseStudy>(
    'SELECT * FROM case_studies WHERE slug = ? AND published = TRUE LIMIT 1',
    [slug]
  );
  return rows[0] ?? null;
}

export async function createCaseStudy(input: CaseStudyInput): Promise<number> {
  const { title, slug, excerpt, body, client_name, industry, published } = input;
  const publishedAt = published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
  const result = await query<{ insertId: number }>(
    'INSERT INTO case_studies (title, slug, excerpt, body, client_name, industry, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, slug, excerpt ?? null, body ?? null, client_name ?? null, industry ?? null, published, publishedAt]
  );
  return (result as any).insertId as number;
}

export async function updateCaseStudy(id: number, input: Partial<CaseStudyInput>): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.title !== undefined)       { fields.push('title = ?');       values.push(input.title); }
  if (input.slug !== undefined)        { fields.push('slug = ?');        values.push(input.slug); }
  if (input.excerpt !== undefined)     { fields.push('excerpt = ?');     values.push(input.excerpt || null); }
  if (input.body !== undefined)        { fields.push('body = ?');        values.push(input.body || null); }
  if (input.client_name !== undefined) { fields.push('client_name = ?'); values.push(input.client_name || null); }
  if (input.industry !== undefined)    { fields.push('industry = ?');    values.push(input.industry || null); }
  if (input.published !== undefined) {
    fields.push('published = ?');
    values.push(input.published);
    fields.push('published_at = ?');
    values.push(input.published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null);
  }

  if (fields.length === 0) return;
  values.push(id);
  await query(`UPDATE case_studies SET ${fields.join(', ')} WHERE id = ?`, values as (string | number | boolean | null)[]);
}

export async function deleteCaseStudy(id: number): Promise<void> {
  await query('DELETE FROM case_studies WHERE id = ?', [id]);
}

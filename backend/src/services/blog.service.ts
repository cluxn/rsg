import { query } from '../db/connection';

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

export interface CreatePostData {
  title: string;
  slug: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
  published?: boolean;
}

export async function listPublishedPosts(): Promise<Omit<BlogPost, 'body' | 'updated_at'>[]> {
  return query(
    'SELECT id, slug, title, meta_description, published_at, created_at FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC'
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const rows = await query<BlogPost>(
    'SELECT * FROM blog_posts WHERE slug = ? AND published = TRUE LIMIT 1',
    [slug]
  );
  return rows[0];
}

export async function getAllPosts(): Promise<Omit<BlogPost, 'body' | 'meta_title' | 'meta_description' | 'updated_at'>[]> {
  return query(
    'SELECT id, slug, title, published, published_at, created_at FROM blog_posts ORDER BY created_at DESC'
  );
}

export async function createPost(data: CreatePostData): Promise<{ insertId: number }> {
  const { title, slug, body, meta_title, meta_description, published = false } = data;
  const published_at = published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
  const rows = await query<{ insertId: number }>(
    'INSERT INTO blog_posts (slug, title, body, meta_title, meta_description, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [slug, title, body, meta_title ?? null, meta_description ?? null, published, published_at]
  );
  return rows[0];
}

export async function updatePost(id: number, data: Partial<CreatePostData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug); }
  if (data.body !== undefined) { fields.push('body = ?'); params.push(data.body); }
  if (data.meta_title !== undefined) { fields.push('meta_title = ?'); params.push(data.meta_title); }
  if (data.meta_description !== undefined) { fields.push('meta_description = ?'); params.push(data.meta_description); }
  if (data.published !== undefined) {
    fields.push('published = ?');
    params.push(data.published);
    if (data.published) { fields.push('published_at = NOW()'); }
  }
  fields.push('updated_at = NOW()');
  params.push(id);

  await query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deletePost(id: number): Promise<void> {
  await query('DELETE FROM blog_posts WHERE id = ?', [id]);
}

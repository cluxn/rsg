import { query } from '../db/connection';

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

export interface CreatePostData {
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
  status?: ContentStatus;
  scheduled_at?: string | null;
}

const ADMIN_LIST_FIELDS =
  'id, slug, title, category, service, industry, excerpt, featured_image, author_name, featured, status, scheduled_at, published, published_at, created_at';

/** Flip any scheduled posts whose time has arrived to published — call before any read. */
async function publishDuePosts(): Promise<void> {
  await query(
    `UPDATE blog_posts SET status = 'published', published = TRUE, published_at = COALESCE(published_at, NOW())
     WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()`
  );
}

export async function listPublishedPosts(): Promise<Omit<BlogPost, 'body' | 'updated_at'>[]> {
  await publishDuePosts();
  return query(
    `SELECT ${ADMIN_LIST_FIELDS}, meta_description FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await publishDuePosts();
  const rows = await query<BlogPost>(
    "SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug]
  );
  return rows[0];
}

export async function getAllPosts(): Promise<Omit<BlogPost, 'body' | 'meta_title' | 'meta_description' | 'updated_at'>[]> {
  await publishDuePosts();
  return query(`SELECT ${ADMIN_LIST_FIELDS} FROM blog_posts ORDER BY created_at DESC`);
}

function resolvePublishFields(status: ContentStatus | undefined, scheduledAt: string | null | undefined) {
  const resolvedStatus: ContentStatus = status ?? 'draft';
  const published = resolvedStatus === 'published';
  const scheduled_at = resolvedStatus === 'scheduled' ? (scheduledAt ?? null) : null;
  return { status: resolvedStatus, published, scheduled_at };
}

export async function createPost(data: CreatePostData): Promise<{ insertId: number }> {
  const {
    title, slug, body, category, service, industry, excerpt, featured_image, author_name,
    featured = false, meta_title, meta_description, canonical_url, og_image, status, scheduled_at,
  } = data;
  const resolved = resolvePublishFields(status, scheduled_at);
  const published_at = resolved.published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
  const rows = await query<{ insertId: number }>(
    `INSERT INTO blog_posts
      (slug, title, body, category, service, industry, excerpt, featured_image, author_name, featured,
       meta_title, meta_description, canonical_url, og_image, published, status, scheduled_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug, title, body, category ?? null, service ?? null, industry ?? null, excerpt ?? null,
      featured_image ?? null, author_name ?? null, featured,
      meta_title ?? null, meta_description ?? null, canonical_url ?? null, og_image ?? null,
      resolved.published, resolved.status, resolved.scheduled_at, published_at,
    ]
  );
  return rows[0];
}

export async function updatePost(id: number, data: Partial<CreatePostData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug); }
  if (data.body !== undefined) { fields.push('body = ?'); params.push(data.body); }
  if (data.category !== undefined) { fields.push('category = ?'); params.push(data.category); }
  if (data.service !== undefined) { fields.push('service = ?'); params.push(data.service); }
  if (data.industry !== undefined) { fields.push('industry = ?'); params.push(data.industry); }
  if (data.excerpt !== undefined) { fields.push('excerpt = ?'); params.push(data.excerpt); }
  if (data.featured_image !== undefined) { fields.push('featured_image = ?'); params.push(data.featured_image); }
  if (data.author_name !== undefined) { fields.push('author_name = ?'); params.push(data.author_name); }
  if (data.featured !== undefined) { fields.push('featured = ?'); params.push(data.featured); }
  if (data.meta_title !== undefined) { fields.push('meta_title = ?'); params.push(data.meta_title); }
  if (data.meta_description !== undefined) { fields.push('meta_description = ?'); params.push(data.meta_description); }
  if (data.canonical_url !== undefined) { fields.push('canonical_url = ?'); params.push(data.canonical_url); }
  if (data.og_image !== undefined) { fields.push('og_image = ?'); params.push(data.og_image); }

  if (data.status !== undefined) {
    const resolved = resolvePublishFields(data.status, data.scheduled_at);
    fields.push('status = ?'); params.push(resolved.status);
    fields.push('published = ?'); params.push(resolved.published);
    fields.push('scheduled_at = ?'); params.push(resolved.scheduled_at);
    if (resolved.published) { fields.push('published_at = COALESCE(published_at, NOW())'); }
  }

  fields.push('updated_at = NOW()');
  params.push(id);

  await query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deletePost(id: number): Promise<void> {
  await query('DELETE FROM blog_posts WHERE id = ?', [id]);
}

export async function duplicatePost(id: number): Promise<{ insertId: number }> {
  const rows = await query<BlogPost>('SELECT * FROM blog_posts WHERE id = ? LIMIT 1', [id]);
  const src = rows[0];
  if (!src) throw new Error('Post not found');

  // Generate a unique slug by appending a timestamp
  const newSlug = `${src.slug}-copy-${Date.now()}`;
  const result = await query<{ insertId: number }>(
    `INSERT INTO blog_posts
      (slug, title, body, category, service, industry, excerpt, featured_image, author_name, featured,
       meta_title, meta_description, canonical_url, og_image, published, status, scheduled_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, 'draft', NULL, NULL)`,
    [
      newSlug, `Copy of ${src.title}`, src.body,
      src.category ?? null, (src as any).service ?? null, (src as any).industry ?? null,
      src.excerpt ?? null, src.featured_image ?? null, src.author_name ?? null, false,
      src.meta_title ?? null, src.meta_description ?? null, src.canonical_url ?? null, src.og_image ?? null,
    ]
  );
  return result[0];
}

export async function bulkUpdatePostStatus(ids: number[], status: ContentStatus): Promise<void> {
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(', ');
  const published = status === 'published';
  const publishedAt = published ? 'COALESCE(published_at, NOW())' : 'published_at';
  await query(
    `UPDATE blog_posts SET status = ?, published = ?, published_at = ${publishedAt} WHERE id IN (${placeholders})`,
    [status, published, ...ids]
  );
}

import { query } from '../db/connection';

export type ContentStatus = 'draft' | 'scheduled' | 'published';

export interface EventRecord {
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
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  featured: boolean;
  published: boolean;
  status: ContentStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
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
  featured?: boolean;
  status?: ContentStatus;
  scheduled_at?: string | null;
}

const ADMIN_LIST_FIELDS =
  'id, slug, title, event_type, location, excerpt, cover_image, event_date, end_date, featured, status, scheduled_at, published, published_at, created_at';

/** Flip any scheduled events whose time has arrived to published — call before any read. */
async function publishDueEvents(): Promise<void> {
  await query(
    `UPDATE events SET status = 'published', published = TRUE, published_at = COALESCE(published_at, NOW())
     WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()`
  );
}

export async function listPublishedEvents(): Promise<Omit<EventRecord, 'body' | 'updated_at'>[]> {
  await publishDueEvents();
  return query(`SELECT ${ADMIN_LIST_FIELDS} FROM events WHERE status = 'published' ORDER BY event_date DESC`);
}

export async function getEventBySlug(slug: string): Promise<EventRecord | undefined> {
  await publishDueEvents();
  const rows = await query<EventRecord>(
    "SELECT * FROM events WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug]
  );
  return rows[0];
}

export async function getAllEvents(): Promise<Omit<EventRecord, 'body' | 'updated_at'>[]> {
  await publishDueEvents();
  return query(`SELECT ${ADMIN_LIST_FIELDS} FROM events ORDER BY created_at DESC`);
}

function resolvePublishFields(status: ContentStatus | undefined, scheduledAt: string | null | undefined) {
  const resolvedStatus: ContentStatus = status ?? 'draft';
  const published = resolvedStatus === 'published';
  const scheduled_at = resolvedStatus === 'scheduled' ? (scheduledAt ?? null) : null;
  return { status: resolvedStatus, published, scheduled_at };
}

export async function createEvent(data: CreateEventData): Promise<{ insertId: number }> {
  const {
    title, slug, body, event_type, location, excerpt, cover_image, event_date, end_date,
    meta_title, meta_description, canonical_url, og_image, featured = false, status, scheduled_at,
  } = data;
  const resolved = resolvePublishFields(status, scheduled_at);
  const published_at = resolved.published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
  const rows = await query<{ insertId: number }>(
    `INSERT INTO events
      (slug, title, body, event_type, location, excerpt, cover_image, event_date, end_date,
       meta_title, meta_description, canonical_url, og_image, featured, published, status, scheduled_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug, title, body, event_type ?? null, location ?? null, excerpt ?? null, cover_image ?? null,
      event_date ?? null, end_date ?? null,
      meta_title ?? null, meta_description ?? null, canonical_url ?? null, og_image ?? null, featured,
      resolved.published, resolved.status, resolved.scheduled_at, published_at,
    ]
  );
  return rows[0];
}

export async function updateEvent(id: number, data: Partial<CreateEventData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug); }
  if (data.body !== undefined) { fields.push('body = ?'); params.push(data.body); }
  if (data.event_type !== undefined) { fields.push('event_type = ?'); params.push(data.event_type); }
  if (data.location !== undefined) { fields.push('location = ?'); params.push(data.location); }
  if (data.excerpt !== undefined) { fields.push('excerpt = ?'); params.push(data.excerpt); }
  if (data.cover_image !== undefined) { fields.push('cover_image = ?'); params.push(data.cover_image); }
  if (data.event_date !== undefined) { fields.push('event_date = ?'); params.push(data.event_date); }
  if (data.end_date !== undefined) { fields.push('end_date = ?'); params.push(data.end_date); }
  if (data.meta_title !== undefined) { fields.push('meta_title = ?'); params.push(data.meta_title); }
  if (data.meta_description !== undefined) { fields.push('meta_description = ?'); params.push(data.meta_description); }
  if (data.canonical_url !== undefined) { fields.push('canonical_url = ?'); params.push(data.canonical_url); }
  if (data.og_image !== undefined) { fields.push('og_image = ?'); params.push(data.og_image); }
  if (data.featured !== undefined) { fields.push('featured = ?'); params.push(data.featured); }

  if (data.status !== undefined) {
    const resolved = resolvePublishFields(data.status, data.scheduled_at);
    fields.push('status = ?'); params.push(resolved.status);
    fields.push('published = ?'); params.push(resolved.published);
    fields.push('scheduled_at = ?'); params.push(resolved.scheduled_at);
    if (resolved.published) { fields.push('published_at = COALESCE(published_at, NOW())'); }
  }

  fields.push('updated_at = NOW()');
  params.push(id);

  await query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteEvent(id: number): Promise<void> {
  await query('DELETE FROM events WHERE id = ?', [id]);
}

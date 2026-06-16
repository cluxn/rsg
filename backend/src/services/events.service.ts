import { query } from '../db/connection';

export interface EventRecord {
  id: number;
  slug: string;
  title: string;
  body: string;
  event_date?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  slug: string;
  body: string;
  event_date?: string;
  published?: boolean;
}

export async function listPublishedEvents(): Promise<Omit<EventRecord, 'body' | 'updated_at'>[]> {
  return query(
    'SELECT id, slug, title, event_date, published, created_at FROM events WHERE published = TRUE ORDER BY event_date DESC'
  );
}

export async function getEventBySlug(slug: string): Promise<EventRecord | undefined> {
  const rows = await query<EventRecord>(
    'SELECT * FROM events WHERE slug = ? AND published = TRUE LIMIT 1',
    [slug]
  );
  return rows[0];
}

export async function getAllEvents(): Promise<Omit<EventRecord, 'body' | 'updated_at'>[]> {
  return query(
    'SELECT id, slug, title, event_date, published, created_at FROM events ORDER BY created_at DESC'
  );
}

export async function createEvent(data: CreateEventData): Promise<{ insertId: number }> {
  const { title, slug, body, event_date, published = false } = data;
  const rows = await query<{ insertId: number }>(
    'INSERT INTO events (slug, title, body, event_date, published) VALUES (?, ?, ?, ?, ?)',
    [slug, title, body, event_date ?? null, published]
  );
  return rows[0];
}

export async function updateEvent(id: number, data: Partial<CreateEventData>): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug); }
  if (data.body !== undefined) { fields.push('body = ?'); params.push(data.body); }
  if (data.event_date !== undefined) { fields.push('event_date = ?'); params.push(data.event_date); }
  if (data.published !== undefined) { fields.push('published = ?'); params.push(data.published); }
  fields.push('updated_at = NOW()');
  params.push(id);

  await query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteEvent(id: number): Promise<void> {
  await query('DELETE FROM events WHERE id = ?', [id]);
}

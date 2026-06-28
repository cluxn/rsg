import { stringify } from 'csv-stringify/sync';
import { query } from '../db/connection';

export async function subscribeNewsletter(email: string, name?: string): Promise<void> {
  await query(
    'INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE active = 1, name = COALESCE(?, name)',
    [email, name ?? null, name ?? null]
  );
}

type Subscriber = { id: number; email: string; name: string | null; subscribed_at: string; active: number };

export async function getSubscribers(): Promise<Subscriber[]> {
  return query<Subscriber>('SELECT id, email, name, subscribed_at, active FROM newsletter_subscribers ORDER BY subscribed_at DESC');
}

export async function deleteSubscriber(id: number): Promise<void> {
  await query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
}

export async function exportSubscribersToCSV(): Promise<string> {
  const rows = await getSubscribers();
  return stringify(rows.map(r => ({
    ID: r.id,
    Email: r.email,
    Name: r.name ?? '',
    'Subscribed At': r.subscribed_at,
    Active: r.active ? 'Yes' : 'No',
  })), { header: true });
}

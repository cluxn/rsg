import { query } from '../db/connection';

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await query<{ key: string; value: string }>('SELECT `key`, value FROM settings');
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function upsertSetting(key: string, value: string): Promise<void> {
  await query(
    'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()',
    [key, value]
  );
}

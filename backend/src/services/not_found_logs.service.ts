import { query, pool } from '../db/connection';

export interface NotFoundLog {
  id: number;
  url: string;
  referrer: string | null;
  user_agent: string | null;
  hits: number;
  last_seen_at: string;
  created_at: string;
}

export async function recordNotFound(url: string, referrer: string | null, userAgent: string | null): Promise<void> {
  await pool.execute(
    `INSERT INTO not_found_logs (url, referrer, user_agent) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE hits = hits + 1, last_seen_at = CURRENT_TIMESTAMP, referrer = VALUES(referrer), user_agent = VALUES(user_agent)`,
    [url, referrer, userAgent]
  );
}

export async function listNotFoundLogs(): Promise<NotFoundLog[]> {
  return query('SELECT * FROM not_found_logs ORDER BY last_seen_at DESC');
}

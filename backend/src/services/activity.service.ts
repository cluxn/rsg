import { query } from '../db/connection';

export async function logActivity(
  adminId: number | null,
  action: string,
  entity: string,
  entityId: number | null,
  detail?: string
): Promise<void> {
  try {
    await query(
      'INSERT INTO admin_activity_log (admin_id, action, entity, entity_id, detail) VALUES (?, ?, ?, ?, ?)',
      [adminId, action, entity, entityId, detail ?? null]
    );
  } catch {
    // Never let logging failure break the main operation
  }
}

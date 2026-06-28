import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';
import { requireAuth } from '../middleware/auth';
import { getLeadSourceBreakdown, getLeadFunnelCounts } from '../services/leads.service';
import { query } from '../db/connection';

const router = Router();

router.get('/summary', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  const [
    [statsRows],
    [todayFollowups],
    [newLeadsToday],
    [upcomingEvents],
    [scheduledPosts],
    [recentLeads],
    [mediaRows],
    sources,
    funnel,
  ] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*) FROM leads) AS total_leads,
        (SELECT COUNT(*) FROM leads WHERE lead_status = 'new') AS new_leads,
        (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') AS blog_posts,
        (SELECT COUNT(*) FROM events WHERE status = 'published') AS published_events
    `),
    pool.query(`
      SELECT id, name, phone, product_interest, lead_status, follow_up_date
      FROM leads
      WHERE DATE(follow_up_date) = CURDATE()
        AND lead_status NOT IN ('converted','closed','lost','junk')
      ORDER BY created_at DESC
    `),
    pool.query(`
      SELECT id, name, phone, product_interest, source_page, created_at
      FROM leads
      WHERE DATE(created_at) = CURDATE()
      ORDER BY created_at DESC
    `),
    pool.query(`
      SELECT id, slug, title, event_type, event_date, location
      FROM events
      WHERE event_date >= CURDATE() AND event_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND status = 'published'
      ORDER BY event_date ASC
      LIMIT 5
    `),
    pool.query(`
      SELECT id, slug, title, scheduled_at, category
      FROM blog_posts
      WHERE status = 'scheduled'
      ORDER BY scheduled_at ASC
      LIMIT 5
    `),
    pool.query(`
      SELECT id, name, phone, product_interest, lead_status, source_page, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 6
    `),
    pool.query('SELECT COUNT(*) AS cnt FROM media'),
    getLeadSourceBreakdown(),
    getLeadFunnelCounts(),
  ]) as [[Record<string, number>[], unknown], [Record<string, unknown>[], unknown], [Record<string, unknown>[], unknown], [Record<string, unknown>[], unknown], [Record<string, unknown>[], unknown], [Record<string, unknown>[], unknown], [Record<string, unknown>[], unknown], unknown, unknown];

  const s = statsRows[0] ?? {};

  res.json({
    stats: {
      total_leads: Number(s.total_leads ?? 0),
      new_leads: Number(s.new_leads ?? 0),
      blog_posts: Number(s.blog_posts ?? 0),
      published_events: Number(s.published_events ?? 0),
      media_count: Number((mediaRows[0] as Record<string, unknown>)?.cnt ?? 0),
    },
    today_followups: todayFollowups,
    new_leads_today: newLeadsToday,
    upcoming_events: upcomingEvents,
    scheduled_posts: scheduledPosts,
    recent_leads: recentLeads,
    lead_sources: sources,
    lead_funnel: funnel,
  });
});

router.get('/activity', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  const rows = await query<{
    id: number;
    admin_id: number | null;
    action: string;
    entity: string;
    entity_id: number | null;
    detail: string | null;
    created_at: string;
    admin_email: string | null;
  }>(`
    SELECT l.id, l.admin_id, l.action, l.entity, l.entity_id, l.detail, l.created_at,
           a.email AS admin_email
    FROM admin_activity_log l
    LEFT JOIN admin_users a ON a.id = l.admin_id
    ORDER BY l.created_at DESC
    LIMIT 100
  `);
  res.json(rows);
});

export default router;

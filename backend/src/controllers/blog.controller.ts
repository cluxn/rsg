import { Request, Response } from 'express';
import { z } from 'zod';
import {
  listPublishedPosts,
  getPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  duplicatePost,
  bulkUpdatePostStatus,
  type ContentStatus,
} from '../services/blog.service';

const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().default(''),
  category: z.string().optional(),
  service: z.string().optional(),
  industry: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  author_name: z.string().optional(),
  featured: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  scheduled_at: z.string().nullable().optional(),
});

export async function getPublishedPosts(_req: Request, res: Response): Promise<void> {
  res.json(await listPublishedPosts());
}

export async function getPostBySlugHandler(req: Request, res: Response): Promise<void> {
  const post = await getPostBySlug(String(req.params.slug));
  if (!post) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(post);
}

export async function getAllPostsAdmin(_req: Request, res: Response): Promise<void> {
  res.json(await getAllPosts());
}

export async function createPostHandler(req: Request, res: Response): Promise<void> {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const result = await createPost(parsed.data) as unknown as { insertId: number };
  res.status(201).json({ ok: true, id: result.insertId });
}

export async function updatePostHandler(req: Request, res: Response): Promise<void> {
  await updatePost(Number(req.params.id), req.body as Record<string, unknown>);
  res.json({ ok: true });
}

export async function deletePostHandler(req: Request, res: Response): Promise<void> {
  await deletePost(Number(req.params.id));
  res.json({ ok: true });
}

export async function duplicatePostHandler(req: Request, res: Response): Promise<void> {
  try {
    const result = await duplicatePost(Number(req.params.id)) as unknown as { insertId: number };
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error('duplicatePost error:', err);
    res.status(500).json({ error: 'Duplicate failed' });
  }
}

export async function bulkUpdatePostsHandler(req: Request, res: Response): Promise<void> {
  const { ids, status } = req.body as { ids: number[]; status: ContentStatus };
  if (!Array.isArray(ids) || ids.length === 0) { res.status(400).json({ error: 'ids required' }); return; }
  if (!['draft', 'scheduled', 'published'].includes(status)) { res.status(400).json({ error: 'invalid status' }); return; }
  try {
    await bulkUpdatePostStatus(ids, status);
    res.json({ ok: true, affected: ids.length });
  } catch (err) {
    console.error('bulkUpdatePosts error:', err);
    res.status(500).json({ error: 'Bulk update failed' });
  }
}

import { Request, Response } from 'express';
import { z } from 'zod';
import {
  listPublishedPosts,
  getPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '../services/blog.service';

const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().default(''),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  published: z.boolean().default(false),
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

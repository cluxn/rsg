import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  getAllCaseStudies,
  getPublishedCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from '../services/case_studies.service';

const caseStudySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens'),
  excerpt: z.string().max(1000).optional(),
  body: z.string().optional(),
  client_name: z.string().max(255).optional(),
  industry: z.string().max(255).optional(),
  published: z.boolean().default(false),
});

export async function listPublished(req: Request, res: Response): Promise<void> {
  try {
    const studies = await getPublishedCaseStudies();
    res.json(studies);
  } catch (err) {
    console.error('listPublished case studies error:', err);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
}

export async function getBySlug(req: Request, res: Response): Promise<void> {
  try {
    const study = await getCaseStudyBySlug(String(req.params.slug));
    if (!study) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(study);
  } catch (err) {
    console.error('getBySlug case study error:', err);
    res.status(500).json({ error: 'Failed to fetch case study' });
  }
}

export async function listAll(req: Request, res: Response): Promise<void> {
  try {
    const studies = await getAllCaseStudies();
    res.json(studies);
  } catch (err) {
    console.error('listAll case studies error:', err);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = caseStudySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  try {
    const id = await createCaseStudy(parsed.data);
    res.status(201).json({ id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('Duplicate entry') || msg.includes('ER_DUP_ENTRY')) {
      res.status(409).json({ error: 'Slug already exists' });
    } else {
      console.error('create case study error:', err);
      res.status(500).json({ error: 'Failed to create case study' });
    }
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseInt(String(req.params.id), 10);
  if (!id) { res.status(400).json({ error: 'Invalid id' }); return; }
  const parsed = caseStudySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  try {
    await updateCaseStudy(id, parsed.data);
    res.json({ success: true });
  } catch (err) {
    console.error('update case study error:', err);
    res.status(500).json({ error: 'Failed to update case study' });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parseInt(String(req.params.id), 10);
  if (!id) { res.status(400).json({ error: 'Invalid id' }); return; }
  try {
    await deleteCaseStudy(id);
    res.json({ success: true });
  } catch (err) {
    console.error('delete case study error:', err);
    res.status(500).json({ error: 'Failed to delete case study' });
  }
}

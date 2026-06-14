import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const isAuthed = !!req.admin;
  const hasSecret = req.body?.secret === process.env.REVALIDATE_SECRET;
  if (!isAuthed && !hasSecret) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const { path, tag } = req.body as { path?: string; tag?: string };
  if (!path && !tag) { res.status(400).json({ error: 'path or tag required' }); return; }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const response = await fetch(`${frontendUrl}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET, path, tag }),
  });
  const data = await response.json() as unknown;
  res.json(data);
});

export { router as revalidateRouter };
export default router;

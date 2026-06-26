import { Router } from 'express';
import { getRedirects, getActiveRedirects, addRedirect, editRedirect, removeRedirect } from '../controllers/redirects.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/active', getActiveRedirects);        // public — consumed by Next.js middleware
router.get('/',       requireAuth, getRedirects);
router.post('/',      requireAuth, addRedirect);
router.put('/:id',    requireAuth, editRedirect);
router.delete('/:id', requireAuth, removeRedirect);

export default router;

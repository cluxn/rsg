import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { listPublished, getBySlug, listAll, create, update, remove } from '../controllers/case_studies.controller';

const router = Router();

router.get('/', listPublished);                     // public
router.get('/admin/all', requireAuth, listAll);     // admin
router.get('/:slug', getBySlug);                    // public
router.post('/', requireAuth, create);              // admin
router.put('/:id', requireAuth, update);            // admin
router.delete('/:id', requireAuth, remove);         // admin

export default router;

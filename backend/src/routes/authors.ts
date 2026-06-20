import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getAuthorsAdmin, createAuthorHandler,
  updateAuthorHandler, deleteAuthorHandler,
} from '../controllers/authors.controller';

const router = Router();

router.get('/admin/all', requireAuth, getAuthorsAdmin);
router.post('/', requireAuth, createAuthorHandler);
router.put('/:id', requireAuth, updateAuthorHandler);
router.delete('/:id', requireAuth, deleteAuthorHandler);

export default router;

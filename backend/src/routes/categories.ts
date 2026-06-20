import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getCategoriesPublic, getAllCategoriesAdmin,
  createCategoryHandler, updateCategoryHandler, deleteCategoryHandler,
} from '../controllers/categories.controller';

const router = Router();

router.get('/', getCategoriesPublic);
router.get('/admin/all', requireAuth, getAllCategoriesAdmin);
router.post('/', requireAuth, createCategoryHandler);
router.put('/:id', requireAuth, updateCategoryHandler);
router.delete('/:id', requireAuth, deleteCategoryHandler);

export default router;

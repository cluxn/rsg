import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getActiveTestimonials,
  getAllTestimonialsAdmin,
  createTestimonialHandler,
  updateTestimonialHandler,
  deleteTestimonialHandler,
} from '../controllers/testimonials.controller';

const router = Router();

router.get('/admin/all', requireAuth, getAllTestimonialsAdmin);
router.get('/', getActiveTestimonials);
router.post('/', requireAuth, createTestimonialHandler);
router.put('/:id', requireAuth, updateTestimonialHandler);
router.delete('/:id', requireAuth, deleteTestimonialHandler);

export default router;

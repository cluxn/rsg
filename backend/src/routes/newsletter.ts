import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { subscribe, listSubscribers, removeSubscriber, exportSubscribers } from '../controllers/newsletter.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

const subscribeLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many subscription attempts. Please try again later.' },
});

router.post('/', subscribeLimit, subscribe);            // public  — POST /api/newsletter
router.get('/', requireAuth, listSubscribers);          // admin   — GET /api/newsletter
router.get('/export', requireAuth, exportSubscribers);  // admin   — GET /api/newsletter/export
router.delete('/:id', requireAuth, removeSubscriber);   // admin   — DELETE /api/newsletter/:id

export default router;

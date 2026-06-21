import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { reportNotFound, getNotFoundLogs } from '../controllers/not_found_logs.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

const reportRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', reportRateLimit, reportNotFound); // public — POST /api/404-logs
router.get('/', requireAuth, getNotFoundLogs);      // admin — GET /api/404-logs

export default router;

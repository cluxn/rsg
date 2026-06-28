import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { submitLead, listLeads, exportLeads, downloadLeadSample, importLeads, createLeadAdmin, updateLeadHandler, deleteLeadHandler, bulkLeadsHandler, checkDuplicatePhoneHandler, leadStatsHandler } from '../controllers/leads.controller';
import { requireAuth } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

const submitRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this IP. Please try again later.' },
});

router.post('/', submitRateLimit, submitLead);                           // public — POST /api/leads
router.get('/', requireAuth, listLeads);                                 // admin — GET /api/leads
router.get('/export', requireAuth, exportLeads);                         // admin — GET /api/leads/export?format=csv|xlsx
router.get('/sample', requireAuth, downloadLeadSample);                  // admin — GET /api/leads/sample
router.get('/stats', requireAuth, leadStatsHandler);                     // admin — GET /api/leads/stats
router.get('/check-phone', requireAuth, checkDuplicatePhoneHandler);     // admin — GET /api/leads/check-phone?phone=xxx
router.post('/import', requireAuth, upload.single('file'), importLeads); // admin — POST /api/leads/import
router.post('/admin', requireAuth, createLeadAdmin);                     // admin — POST /api/leads/admin (manual entry)
router.post('/bulk', requireAuth, bulkLeadsHandler);                     // admin — POST /api/leads/bulk
router.put('/:id', requireAuth, updateLeadHandler);                      // admin — PUT /api/leads/:id
router.delete('/:id', requireAuth, deleteLeadHandler);                   // admin — DELETE /api/leads/:id

export default router;

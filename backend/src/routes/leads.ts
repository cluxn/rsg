import { Router } from 'express';
import multer from 'multer';
import { submitLead, listLeads, exportLeads, importLeads } from '../controllers/leads.controller';
import { requireAuth } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

router.post('/', submitLead);                                       // public — POST /api/leads
router.get('/', requireAuth, listLeads);                            // admin — GET /api/leads
router.get('/export', requireAuth, exportLeads);                    // admin — GET /api/leads/export
router.post('/import', requireAuth, upload.single('file'), importLeads); // admin — POST /api/leads/import

export default router;

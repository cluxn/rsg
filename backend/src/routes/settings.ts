import { Router } from 'express';
import { getSettings, updateSettings, exportSettings, importSettings } from '../controllers/settings.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, updateSettings);
router.get('/export', requireAuth, exportSettings);
router.post('/import', requireAuth, importSettings);

export default router;

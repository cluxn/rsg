import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getClientLogosPublic, getClientLogosAdmin,
  createClientLogoHandler, updateClientLogoHandler,
  deleteClientLogoHandler, reorderClientLogosHandler,
} from '../controllers/client_logos.controller';

const router = Router();

router.get('/', getClientLogosPublic);
router.get('/admin/all', requireAuth, getClientLogosAdmin);
router.post('/', requireAuth, createClientLogoHandler);
router.post('/reorder', requireAuth, reorderClientLogosHandler);
router.put('/:id', requireAuth, updateClientLogoHandler);
router.delete('/:id', requireAuth, deleteClientLogoHandler);

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getPublishedEvents,
  getEventBySlugHandler,
  getAllEventsAdmin,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/events.controller';

const router = Router();

router.get('/admin/all', requireAuth, getAllEventsAdmin);
router.get('/', getPublishedEvents);
router.get('/:slug', getEventBySlugHandler);
router.post('/', requireAuth, createEventHandler);
router.put('/:id', requireAuth, updateEventHandler);
router.delete('/:id', requireAuth, deleteEventHandler);

export default router;

import { Router } from 'express';
import { submitLead } from '../controllers/leads.controller';

const router = Router();
router.post('/', submitLead); // POST /api/leads
export default router;

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, updateProfile, getUsers, addUser, toggleUserStatus, resetUserPassword } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.post('/login', loginRateLimit, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);

router.get('/users', requireAuth, getUsers);
router.post('/users', requireAuth, addUser);
router.put('/users/:id/status', requireAuth, toggleUserStatus);
router.put('/users/:id/reset-password', requireAuth, resetUserPassword);

export default router;

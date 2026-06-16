import { Router } from 'express';
import { login, logout, me, updateProfile, getUsers, addUser, toggleUserStatus, resetUserPassword } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);

router.get('/users', requireAuth, getUsers);
router.post('/users', requireAuth, addUser);
router.put('/users/:id/status', requireAuth, toggleUserStatus);
router.put('/users/:id/reset-password', requireAuth, resetUserPassword);

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getPublishedPosts,
  getPostBySlugHandler,
  getAllPostsAdmin,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from '../controllers/blog.controller';

const router = Router();

router.get('/admin/all', requireAuth, getAllPostsAdmin);
router.get('/', getPublishedPosts);
router.get('/:slug', getPostBySlugHandler);
router.post('/', requireAuth, createPostHandler);
router.put('/:id', requireAuth, updatePostHandler);
router.delete('/:id', requireAuth, deletePostHandler);

export default router;

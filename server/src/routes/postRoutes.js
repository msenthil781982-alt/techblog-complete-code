import { Router } from 'express';
import * as postController from '../controllers/postController.js';
import {
  createPostRules,
  updatePostRules,
  listPostsQueryRules,
} from '../validators/postValidators.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly, authorOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listPostsQueryRules, validate, postController.getPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/trending', postController.getTrendingPosts);
router.get('/my-blogs', protect, postController.getMyBlogs);
router.get('/admin/list', protect, adminOnly, postController.getAdminPosts);
router.patch('/:id/status', protect, adminOnly, postController.updatePostStatus);
router.post('/', protect, createPostRules, validate, postController.createPost);
router.put('/:id', protect, authorOrAdmin, updatePostRules, validate, postController.updatePost);
router.delete('/:id', protect, authorOrAdmin, postController.deletePost);
router.get('/:slug', postController.getPostBySlug);

export default router;

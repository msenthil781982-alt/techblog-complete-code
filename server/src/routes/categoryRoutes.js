import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { createCategoryRules, updateCategoryRules } from '../validators/categoryValidators.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post(
  '/',
  protect,
  adminOnly,
  createCategoryRules,
  validate,
  categoryController.createCategory
);

router.put(
  '/:id',
  protect,
  adminOnly,
  updateCategoryRules,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  categoryController.deleteCategory
);

router.post(
  '/resync-counts',
  protect,
  adminOnly,
  categoryController.resyncCategoryCounts
);

export default router;

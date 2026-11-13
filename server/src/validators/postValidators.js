
import { body, param, query } from 'express-validator';

export const createPostRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Post title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),

  body('content')
    .notEmpty().withMessage('Post content is required'),

  body('category')
    .optional({ values: 'falsy' })
    .isMongoId().withMessage('Invalid Category ID format'),

  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'draft', 'published', 'scheduled'])
    .withMessage('Status must be pending, approved, rejected, draft, published, or scheduled'),

  body('scheduledAt')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Scheduled date must be a valid ISO8601 date')
    .custom((val, { req }) => {
      if (req.body.status === 'scheduled') {
        if (!val) {
          throw new Error('Scheduled date is required when status is scheduled');
        }
        if (new Date(val) <= new Date()) {
          throw new Error('Scheduled date must be in the future');
        }
      }
      return true;
    }),

  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt must be 300 characters or less'),

  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),

  body('featuredImage')
    .optional()
    .isObject().withMessage('featuredImage must be an object'),

  body('tags')
    .optional()
    .custom((val) => {
      if (val !== undefined && !Array.isArray(val) && typeof val !== 'string') {
        throw new Error('Tags must be an array of strings or IDs, or comma-separated string');
      }
      return true;
    }),

  body('seo')
    .optional()
    .isObject().withMessage('SEO data must be an object'),
];

export const updatePostRules = [
  param('id')
    .isMongoId().withMessage('Invalid Post ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Post title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),

  body('content')
    .optional()
    .notEmpty().withMessage('Post content cannot be empty'),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid Category ID format'),

  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'draft', 'published', 'scheduled'])
    .withMessage('Status must be pending, approved, rejected, draft, published, or scheduled'),

  body('scheduledAt')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Scheduled date must be a valid date'),

  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt must be 300 characters or less'),

  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),
];

export const listPostsQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['latest', 'popular', 'oldest']).withMessage('Sort must be latest, popular, or oldest'),
];

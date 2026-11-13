
import { body, param } from 'express-validator';

export const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Category name must be under 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),

  body('color')
    .optional()
    .isIn(['blue', 'green', 'purple', 'red', 'orange', 'cyan', 'pink', 'yellow', 'indigo', 'gray'])
    .withMessage('Invalid category color'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Icon identifier must be under 50 characters'),
];

export const updateCategoryRules = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty')
    .isLength({ max: 100 }).withMessage('Category name must be under 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),

  body('color')
    .optional()
    .isIn(['blue', 'green', 'purple', 'red', 'orange', 'cyan', 'pink', 'yellow', 'indigo', 'gray'])
    .withMessage('Invalid category color'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Icon identifier must be under 50 characters'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

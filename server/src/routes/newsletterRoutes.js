import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import * as newsletterController from '../controllers/newsletterController.js';
import validate from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many subscription attempts. Please try again after 15 minutes.',
  },
});

const subscribeRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email.'),
];

router.post('/subscribe', subscribeLimiter, subscribeRules, validate, newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.get('/subscribers', protect, adminOnly, newsletterController.getSubscribers);

export default router;

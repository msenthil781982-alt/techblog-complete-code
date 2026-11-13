import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { loginRules, registerRules, refreshRules } from '../validators/authValidators.js';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginLimiter, loginRules, validate, authController.login);
router.post('/refresh', refreshRules, validate, authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

export default router;

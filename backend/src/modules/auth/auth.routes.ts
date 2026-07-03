import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { limitAuth } from '../../middlewares/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetPasswordImmediateSchema} from './auth.zod';

import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.post('/register', limitAuth, validate(registerSchema), AuthController.register);
router.post('/login', limitAuth, validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', limitAuth, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', limitAuth, validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/reset-password-immediate', limitAuth, validate(resetPasswordImmediateSchema), AuthController.resetPasswordImmediate);
router.get('/me', requireAuth, AuthController.me);

export const authRoutes = router;
export default authRoutes;

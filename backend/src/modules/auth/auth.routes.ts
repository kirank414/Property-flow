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

router.get('/force-seed', async (req, res) => {
  try {
    const { runDemoSeed } = await import('../../scripts/demo-seed');
    await runDemoSeed();
    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Seed failed', details: error });
  }
});

export const authRoutes = router;
export default authRoutes;

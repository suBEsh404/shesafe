import express from 'express';
import authController from '../controllers/authController';
import validate from '../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from '../validators/authValidators';
import { authLimiter } from '../middleware/rateLimiters';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);

export default router;


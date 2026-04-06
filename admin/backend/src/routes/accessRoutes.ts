import express from 'express';
import accessController from '../controllers/accessController';
import validate from '../middleware/validate';
import { authenticateRequired } from '../middleware/authMiddleware';
import { grantSchema, revokeSchema } from '../validators/accessValidators';

const router = express.Router();

router.post('/grant', authenticateRequired, validate(grantSchema), accessController.grant);
router.post('/revoke', authenticateRequired, validate(revokeSchema), accessController.revoke);

export default router;


import express from 'express';
import alertsController from '../controllers/alertsController';
import validate from '../middleware/validate';
import { authenticateRequired } from '../middleware/authMiddleware';
import {
	emergencyAlertSchema,
	liveLocationSchema,
	pushTokenSchema,
	removePushTokenSchema
} from '../validators/alertsValidators';

const router = express.Router();

router.post('/emergency', authenticateRequired, validate(emergencyAlertSchema), alertsController.emergency);
router.post('/live-location', authenticateRequired, validate(liveLocationSchema), alertsController.liveLocation);
router.post('/push-token', authenticateRequired, validate(pushTokenSchema), alertsController.registerPushToken);
router.delete('/push-token', authenticateRequired, validate(removePushTokenSchema), alertsController.removePushToken);

export default router;

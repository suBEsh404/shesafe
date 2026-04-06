import express from 'express';
import adminController from '../controllers/adminController';
import { authenticateRequired, authorizeRoles } from '../middleware/authMiddleware';
import validate from '../middleware/validate';
import { listQuerySchema } from '../validators/commonValidators';
import {
	adminUsersQuerySchema,
	inviteUserSchema,
	updateUserStatusParamsSchema,
	updateUserStatusSchema,
	exportUsersQuerySchema,
	reviewControlsSchema,
	generateReportSchema
} from '../validators/adminValidators';

const router = express.Router();

router.get('/all-evidence', authenticateRequired, authorizeRoles('admin'), validate(listQuerySchema, 'query'), adminController.allEvidence);
router.get('/users', authenticateRequired, authorizeRoles('admin'), validate(adminUsersQuerySchema, 'query'), adminController.users);
router.post('/users/invite', authenticateRequired, authorizeRoles('admin'), validate(inviteUserSchema), adminController.inviteUser);
router.patch('/users/:userId/status', authenticateRequired, authorizeRoles('admin'), validate(updateUserStatusParamsSchema, 'params'), validate(updateUserStatusSchema), adminController.updateUserStatus);
router.get('/users/export', authenticateRequired, authorizeRoles('admin'), validate(exportUsersQuerySchema, 'query'), adminController.exportUsers);
router.get('/settings', authenticateRequired, authorizeRoles('admin'), adminController.settings);
router.get('/project-activity-summary', authenticateRequired, authorizeRoles('admin'), adminController.projectActivitySummary);
router.post('/settings/review-controls', authenticateRequired, authorizeRoles('admin'), validate(reviewControlsSchema), adminController.reviewControls);
router.post('/settings/generate-report', authenticateRequired, authorizeRoles('admin'), validate(generateReportSchema), adminController.generateReport);

export default router;


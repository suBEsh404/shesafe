import express from 'express';
import evidenceController from '../controllers/evidenceController';
import upload from '../middleware/upload';
import validate from '../middleware/validate';
import { authenticateOptional, authenticateRequired } from '../middleware/authMiddleware';
import { uploadSchema, emergencySchema, travelSchema, travelCheckpointSchema, idParamSchema, userParamSchema } from '../validators/evidenceValidators';
import { listQuerySchema } from '../validators/commonValidators';

const router = express.Router();

router.post('/upload', authenticateOptional, upload.array('files', 20), validate(uploadSchema), evidenceController.upload);
router.post('/emergency', authenticateOptional, upload.array('files', 20), validate(emergencySchema), evidenceController.emergency);
router.post('/travel', authenticateOptional, upload.array('files', 20), validate(travelSchema), evidenceController.travel);
router.post('/travel/checkpoint', authenticateOptional, validate(travelCheckpointSchema), evidenceController.travelCheckpoint);
router.get('/user/:userId', authenticateRequired, validate(userParamSchema, 'params'), validate(listQuerySchema, 'query'), evidenceController.listUserEvidence);
router.get('/:id', authenticateRequired, validate(idParamSchema, 'params'), evidenceController.getEvidence);
router.post('/verify/:id', authenticateRequired, validate(idParamSchema, 'params'), evidenceController.verifyEvidence);

export default router;


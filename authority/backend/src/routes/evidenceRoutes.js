const express = require('express');
const evidenceController = require('../controllers/evidenceController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { authenticateOptional, authenticateRequired } = require('../middleware/authMiddleware');
const { uploadSchema, emergencySchema, travelSchema, idParamSchema, userParamSchema } = require('../validators/evidenceValidators');
const { listQuerySchema } = require('../validators/commonValidators');

const router = express.Router();

router.post('/upload', authenticateOptional, upload.array('files', 20), validate(uploadSchema), evidenceController.upload);
router.post('/emergency', authenticateOptional, upload.array('files', 20), validate(emergencySchema), evidenceController.emergency);
router.post('/travel', authenticateOptional, upload.array('files', 20), validate(travelSchema), evidenceController.travel);
router.get('/user/:userId', authenticateRequired, validate(userParamSchema, 'params'), validate(listQuerySchema, 'query'), evidenceController.listUserEvidence);
router.get('/:id', authenticateRequired, validate(idParamSchema, 'params'), evidenceController.getEvidence);
router.post('/verify/:id', authenticateRequired, validate(idParamSchema, 'params'), evidenceController.verifyEvidence);

module.exports = router;

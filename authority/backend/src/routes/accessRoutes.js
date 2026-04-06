const express = require('express');
const accessController = require('../controllers/accessController');
const validate = require('../middleware/validate');
const { authenticateRequired } = require('../middleware/authMiddleware');
const { grantSchema, revokeSchema } = require('../validators/accessValidators');

const router = express.Router();

router.post('/grant', authenticateRequired, validate(grantSchema), accessController.grant);
router.post('/revoke', authenticateRequired, validate(revokeSchema), accessController.revoke);

module.exports = router;

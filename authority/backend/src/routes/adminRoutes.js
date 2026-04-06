const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateRequired, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { listQuerySchema } = require('../validators/commonValidators');

const router = express.Router();

router.get(
  '/all-evidence',
  authenticateRequired,
  authorizeRoles('authority'),
  validate(listQuerySchema, 'query'),
  adminController.allEvidence
);
router.get(
  '/access-logs',
  authenticateRequired,
  authorizeRoles('authority'),
  validate(listQuerySchema, 'query'),
  adminController.accessLogs
);

module.exports = router;

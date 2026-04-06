const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidators');
const { authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);

module.exports = router;

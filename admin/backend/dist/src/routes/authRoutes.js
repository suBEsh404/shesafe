"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const authValidators_1 = require("../validators/authValidators");
const rateLimiters_1 = require("../middleware/rateLimiters");
const router = express_1.default.Router();
router.post('/register', rateLimiters_1.authLimiter, (0, validate_1.default)(authValidators_1.registerSchema), authController_1.default.register);
router.post('/login', rateLimiters_1.authLimiter, (0, validate_1.default)(authValidators_1.loginSchema), authController_1.default.login);
router.post('/refresh', (0, validate_1.default)(authValidators_1.refreshSchema), authController_1.default.refresh);
router.post('/logout', (0, validate_1.default)(authValidators_1.refreshSchema), authController_1.default.logout);
exports.default = router;

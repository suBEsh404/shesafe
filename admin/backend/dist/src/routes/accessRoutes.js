"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accessController_1 = __importDefault(require("../controllers/accessController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accessValidators_1 = require("../validators/accessValidators");
const router = express_1.default.Router();
router.post('/grant', authMiddleware_1.authenticateRequired, (0, validate_1.default)(accessValidators_1.grantSchema), accessController_1.default.grant);
router.post('/revoke', authMiddleware_1.authenticateRequired, (0, validate_1.default)(accessValidators_1.revokeSchema), accessController_1.default.revoke);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alertsController_1 = __importDefault(require("../controllers/alertsController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const alertsValidators_1 = require("../validators/alertsValidators");
const router = express_1.default.Router();
router.post('/emergency', authMiddleware_1.authenticateRequired, (0, validate_1.default)(alertsValidators_1.emergencyAlertSchema), alertsController_1.default.emergency);
router.post('/live-location', authMiddleware_1.authenticateRequired, (0, validate_1.default)(alertsValidators_1.liveLocationSchema), alertsController_1.default.liveLocation);
router.post('/push-token', authMiddleware_1.authenticateRequired, (0, validate_1.default)(alertsValidators_1.pushTokenSchema), alertsController_1.default.registerPushToken);
router.delete('/push-token', authMiddleware_1.authenticateRequired, (0, validate_1.default)(alertsValidators_1.removePushTokenSchema), alertsController_1.default.removePushToken);
exports.default = router;

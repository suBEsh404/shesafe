"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactsController_1 = __importDefault(require("../controllers/contactsController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const contactsValidators_1 = require("../validators/contactsValidators");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateRequired, (0, validate_1.default)(contactsValidators_1.contactsListQuerySchema, 'query'), contactsController_1.default.list);
router.post('/', authMiddleware_1.authenticateRequired, (0, validate_1.default)(contactsValidators_1.createContactSchema), contactsController_1.default.create);
router.patch('/:contactId', authMiddleware_1.authenticateRequired, (0, validate_1.default)(contactsValidators_1.contactIdParamSchema, 'params'), (0, validate_1.default)(contactsValidators_1.updateContactSchema), contactsController_1.default.update);
router.delete('/:contactId', authMiddleware_1.authenticateRequired, (0, validate_1.default)(contactsValidators_1.contactIdParamSchema, 'params'), contactsController_1.default.remove);
exports.default = router;

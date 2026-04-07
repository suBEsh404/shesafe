"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactsListQuerySchema = exports.updateContactSchema = exports.createContactSchema = exports.contactIdParamSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const contactIdParamSchema = joi_1.default.object({
    contactId: joi_1.default.string().length(24).hex().required()
});
exports.contactIdParamSchema = contactIdParamSchema;
const createContactSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120).required(),
    relationship: joi_1.default.string().trim().max(120).allow('', null).default('Trusted Contact'),
    phone: joi_1.default.string().trim().max(30).allow('', null),
    email: joi_1.default.string().email().allow('', null),
    isSharing: joi_1.default.boolean().default(true),
    emergencyPriority: joi_1.default.number().integer().min(1).max(99).default(1),
    notes: joi_1.default.string().trim().max(500).allow('', null)
}).or('phone', 'email');
exports.createContactSchema = createContactSchema;
const updateContactSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120),
    relationship: joi_1.default.string().trim().max(120).allow('', null),
    phone: joi_1.default.string().trim().max(30).allow('', null),
    email: joi_1.default.string().email().allow('', null),
    isSharing: joi_1.default.boolean(),
    emergencyPriority: joi_1.default.number().integer().min(1).max(99),
    notes: joi_1.default.string().trim().max(500).allow('', null)
}).min(1);
exports.updateContactSchema = updateContactSchema;
const contactsListQuerySchema = joi_1.default.object({
    search: joi_1.default.string().trim().max(120).allow('', null).default('')
});
exports.contactsListQuerySchema = contactsListQuerySchema;

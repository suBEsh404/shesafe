"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportSchema = exports.reviewControlsSchema = exports.exportUsersQuerySchema = exports.updateUserStatusSchema = exports.updateUserStatusParamsSchema = exports.inviteUserSchema = exports.adminUsersQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const adminUsersQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(25),
    status: joi_1.default.string().valid('active', 'pending', 'suspended').optional(),
    role: joi_1.default.string().valid('user', 'authority', 'admin').optional(),
    search: joi_1.default.string().trim().max(120).optional()
});
exports.adminUsersQuerySchema = adminUsersQuerySchema;
const inviteUserSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(120).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(10).max(128).required(),
    confirmPassword: joi_1.default.string().min(10).max(128).valid(joi_1.default.ref('password')).required(),
    role: joi_1.default.string().valid('user', 'authority', 'admin').default('authority')
});
exports.inviteUserSchema = inviteUserSchema;
const updateUserStatusParamsSchema = joi_1.default.object({
    userId: joi_1.default.string().length(24).hex().required()
});
exports.updateUserStatusParamsSchema = updateUserStatusParamsSchema;
const updateUserStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('active', 'suspended').required()
});
exports.updateUserStatusSchema = updateUserStatusSchema;
const exportUsersQuerySchema = joi_1.default.object({
    format: joi_1.default.string().valid('json', 'csv').default('csv'),
    status: joi_1.default.string().valid('active', 'pending', 'suspended').optional(),
    role: joi_1.default.string().valid('user', 'authority', 'admin').optional(),
    search: joi_1.default.string().trim().max(120).optional()
});
exports.exportUsersQuerySchema = exportUsersQuerySchema;
const reviewControlsSchema = joi_1.default.object({
    notes: joi_1.default.string().trim().max(1000).allow('').optional()
});
exports.reviewControlsSchema = reviewControlsSchema;
const generateReportSchema = joi_1.default.object({
    format: joi_1.default.string().valid('json', 'csv').default('json'),
    from: joi_1.default.date().iso().optional(),
    to: joi_1.default.date().iso().optional()
});
exports.generateReportSchema = generateReportSchema;

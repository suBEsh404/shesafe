"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(120).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(10).max(128).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
    role: joi_1.default.string().valid('user', 'authority', 'admin').default('user'),
    walletAddress: joi_1.default.string().trim().optional(),
    isAnonymous: joi_1.default.boolean().default(false)
});
exports.registerSchema = registerSchema;
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(10).required()
});
exports.loginSchema = loginSchema;
const refreshSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required()
});
exports.refreshSchema = refreshSchema;

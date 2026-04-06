"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.rateLimitWindowMs,
    max: env_1.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});
exports.generalLimiter = generalLimiter;
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.rateLimitWindowMs,
    max: Math.min(env_1.rateLimitMax, 20),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Authentication rate limit exceeded.'
    }
});
exports.authLimiter = authLimiter;

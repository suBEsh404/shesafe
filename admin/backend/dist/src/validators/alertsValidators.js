"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePushTokenSchema = exports.pushTokenSchema = exports.liveLocationSchema = exports.emergencyAlertSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const emergencyAlertSchema = joi_1.default.object({
    sessionId: joi_1.default.string().trim().min(3).max(120).allow('', null),
    message: joi_1.default.string().trim().max(500).allow('', null),
    location: joi_1.default.object({
        latitude: joi_1.default.number().optional(),
        longitude: joi_1.default.number().optional(),
        accuracy: joi_1.default.number().optional()
    }).default({}),
    metadata: joi_1.default.object().unknown(true).default({})
});
exports.emergencyAlertSchema = emergencyAlertSchema;
const liveLocationSchema = joi_1.default.object({
    sessionId: joi_1.default.string().trim().min(3).max(120).required(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
        accuracy: joi_1.default.number().optional()
    }).required(),
    metadata: joi_1.default.object().unknown(true).default({})
});
exports.liveLocationSchema = liveLocationSchema;
const pushTokenSchema = joi_1.default.object({
    token: joi_1.default.string().trim().min(10).max(300).required(),
    deviceId: joi_1.default.string().trim().max(150).allow('', null),
    platform: joi_1.default.string().valid('ios', 'android', 'web', 'unknown').default('unknown')
});
exports.pushTokenSchema = pushTokenSchema;
const removePushTokenSchema = joi_1.default.object({
    token: joi_1.default.string().trim().min(10).max(300).required()
});
exports.removePushTokenSchema = removePushTokenSchema;

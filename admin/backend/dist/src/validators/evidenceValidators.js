"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamSchema = exports.idParamSchema = exports.travelCheckpointSchema = exports.travelSchema = exports.emergencyFinalizeSchema = exports.emergencySchema = exports.uploadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const fileUploadCommon = {
    caseId: joi_1.default.string().min(1).max(120).required(),
    type: joi_1.default.string().valid('emergency', 'report', 'travel').required(),
    isAnonymous: joi_1.default.boolean().default(false),
    ownerAlias: joi_1.default.string().min(3).max(120).allow('', null),
    walletAddress: joi_1.default.string().allow('', null),
    metadata: joi_1.default.object().unknown(true).default({})
};
const uploadSchema = joi_1.default.object({
    ...fileUploadCommon,
    description: joi_1.default.string().max(2000).allow('', null)
});
exports.uploadSchema = uploadSchema;
const emergencySchema = joi_1.default.object({
    ...fileUploadCommon,
    sessionId: joi_1.default.string().min(8).max(120).optional(),
    mode: joi_1.default.string().valid('emergency', 'travel').default('emergency'),
    latitude: joi_1.default.number().optional(),
    longitude: joi_1.default.number().optional(),
    accuracy: joi_1.default.number().optional(),
    locationHash: joi_1.default.string().max(256).allow('', null),
    videoHash: joi_1.default.string().max(256).allow('', null),
    audioHash: joi_1.default.string().max(256).allow('', null),
    chunkHash: joi_1.default.string().max(256).allow('', null),
    chunkIndex: joi_1.default.number().integer().min(1).optional(),
    chunkTimestamp: joi_1.default.date().iso().optional(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().optional(),
        longitude: joi_1.default.number().optional(),
        accuracy: joi_1.default.number().optional()
    }).default({}),
    isFinal: joi_1.default.boolean().default(false)
});
exports.emergencySchema = emergencySchema;
const travelSchema = joi_1.default.object({
    caseId: joi_1.default.string().min(1).max(120).required(),
    sessionId: joi_1.default.string().min(8).max(120).required(),
    type: joi_1.default.string().valid('travel').default('travel'),
    metadata: joi_1.default.object().unknown(true).default({}),
    location: joi_1.default.object({
        latitude: joi_1.default.number().optional(),
        longitude: joi_1.default.number().optional(),
        accuracy: joi_1.default.number().optional()
    }).default({}),
    isFinal: joi_1.default.boolean().default(false)
});
exports.travelSchema = travelSchema;
const travelCheckpointSchema = joi_1.default.object({
    caseId: joi_1.default.string().min(1).max(120).required(),
    sessionId: joi_1.default.string().min(8).max(120).required(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
        accuracy: joi_1.default.number().optional()
    }).required(),
    metadata: joi_1.default.object().unknown(true).default({}),
    isFinal: joi_1.default.boolean().default(false)
});
exports.travelCheckpointSchema = travelCheckpointSchema;
const emergencyFinalizeSchema = joi_1.default.object({
    caseId: joi_1.default.string().min(1).max(120).required(),
    sessionId: joi_1.default.string().min(8).max(120).required(),
    type: joi_1.default.string().valid('emergency').default('emergency'),
    mode: joi_1.default.string().valid('emergency').default('emergency'),
    isFinal: joi_1.default.boolean().default(true),
    metadata: joi_1.default.object().unknown(true).default({})
});
exports.emergencyFinalizeSchema = emergencyFinalizeSchema;
const idParamSchema = joi_1.default.object({
    id: joi_1.default.string().required()
});
exports.idParamSchema = idParamSchema;
const userParamSchema = joi_1.default.object({
    userId: joi_1.default.string().required()
});
exports.userParamSchema = userParamSchema;

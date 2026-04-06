"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accessLogSchema = new mongoose_1.default.Schema({
    evidenceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Evidence',
        required: true,
        index: true
    },
    accessedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        enum: ['view', 'download', 'share', 'grant', 'revoke', 'verify'],
        required: true,
        index: true
    },
    ipAddress: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['allowed', 'blocked', 'pending'],
        default: 'allowed'
    },
    details: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
const AccessLog = mongoose_1.default.model('AccessLog', accessLogSchema);
exports.default = AccessLog;

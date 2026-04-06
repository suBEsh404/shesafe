"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const retryJobSchema = new mongoose_1.default.Schema({
    jobType: {
        type: String,
        required: true,
        index: true
    },
    payload: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['queued', 'processing', 'succeeded', 'failed'],
        default: 'queued',
        index: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    nextRetryAt: {
        type: Date,
        default: null,
        index: true
    },
    lastError: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
const RetryJob = mongoose_1.default.model('RetryJob', retryJobSchema);
exports.default = RetryJob;

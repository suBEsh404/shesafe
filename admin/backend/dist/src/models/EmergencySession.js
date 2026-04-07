"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emergencyChunkSchema = new mongoose_1.default.Schema({
    sequence: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        enum: ['cloudinary', 'ipfs'],
        default: 'cloudinary'
    },
    mimeType: String,
    size: Number,
    isEncrypted: {
        type: Boolean,
        default: false
    },
    iv: {
        type: String,
        default: null
    },
    authTag: {
        type: String,
        default: null
    },
    originalHash: {
        type: String,
        required: true
    },
    locationHash: {
        type: String,
        default: null
    },
    videoHash: {
        type: String,
        default: null
    },
    audioHash: {
        type: String,
        default: null
    },
    chunkHash: {
        type: String,
        default: null
    },
    chunkIndex: {
        type: Number,
        default: null
    },
    location: {
        latitude: Number,
        longitude: Number,
        accuracy: Number
    },
    capturedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
const emergencySessionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        default: null
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    caseId: {
        type: String,
        trim: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['emergency', 'travel'],
        default: 'emergency',
        index: true
    },
    chunks: {
        type: [emergencyChunkSchema],
        default: []
    },
    status: {
        type: String,
        enum: ['open', 'sealed', 'synced', 'failed'],
        default: 'open',
        index: true
    },
    startedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastActivityAt: {
        type: Date,
        default: Date.now
    },
    finalizedAt: {
        type: Date,
        default: null
    },
    metadata: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {}
    },
    hash: {
        type: String,
        default: null,
        index: true
    },
    blockchainTxHash: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
const EmergencySession = mongoose_1.default.model('EmergencySession', emergencySessionSchema);
exports.default = EmergencySession;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emergencyAlertSchema = new mongoose_1.default.Schema({
    ownerUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    alertType: {
        type: String,
        enum: ['emergency', 'live-location'],
        default: 'emergency',
        index: true
    },
    sessionId: {
        type: String,
        default: null,
        index: true
    },
    message: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['queued', 'sent', 'failed'],
        default: 'sent',
        index: true
    },
    location: {
        latitude: Number,
        longitude: Number,
        accuracy: Number
    },
    notifiedContacts: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'TrustedContact',
        default: []
    },
    metadata: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
emergencyAlertSchema.index({ ownerUserId: 1, createdAt: -1 });
const EmergencyAlert = mongoose_1.default.model('EmergencyAlert', emergencyAlertSchema);
exports.default = EmergencyAlert;

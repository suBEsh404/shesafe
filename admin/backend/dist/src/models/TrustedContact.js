"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trustedContactSchema = new mongoose_1.default.Schema({
    ownerUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    relationship: {
        type: String,
        trim: true,
        default: 'Trusted Contact'
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
    },
    isSharing: {
        type: Boolean,
        default: true,
        index: true
    },
    emergencyPriority: {
        type: Number,
        default: 1
    },
    notes: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
trustedContactSchema.index({ ownerUserId: 1, createdAt: -1 });
const TrustedContact = mongoose_1.default.model('TrustedContact', trustedContactSchema);
exports.default = TrustedContact;

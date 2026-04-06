"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accessControlSchema = new mongoose_1.default.Schema({
    evidenceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Evidence',
        required: true,
        index: true
    },
    grantedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    grantedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    permissions: {
        type: [String],
        enum: ['view', 'download', 'share'],
        default: ['view']
    },
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active',
        index: true
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
accessControlSchema.index({ evidenceId: 1, grantedTo: 1 }, { unique: true });
const AccessControl = mongoose_1.default.model('AccessControl', accessControlSchema);
exports.default = AccessControl;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminReportSchema = new mongoose_1.default.Schema({
    reportType: {
        type: String,
        enum: ['audit', 'security_review'],
        required: true,
        index: true
    },
    requestedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    format: {
        type: String,
        enum: ['json', 'csv'],
        default: 'json'
    },
    rangeFrom: {
        type: Date,
        default: null
    },
    rangeTo: {
        type: Date,
        default: null
    },
    downloadName: {
        type: String,
        default: null
    },
    summary: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
adminReportSchema.index({ reportType: 1, createdAt: -1 });
adminReportSchema.index({ requestedBy: 1, createdAt: -1 });
const AdminReport = mongoose_1.default.model('AdminReport', adminReportSchema);
exports.default = AdminReport;

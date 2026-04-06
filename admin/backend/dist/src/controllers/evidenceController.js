"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEvidence = exports.listUserEvidence = exports.getEvidence = exports.travel = exports.emergency = exports.upload = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const evidenceService_1 = __importDefault(require("../services/evidenceService"));
const queueService_1 = require("../services/queueService");
const upload = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await evidenceService_1.default.uploadEvidence({
        files: req.files,
        input: req.body,
        user: req.user
    });
    res.status(201).json({
        success: true,
        message: 'Evidence uploaded successfully',
        data: result
    });
});
exports.upload = upload;
const emergency = (0, asyncHandler_1.default)(async (req, res) => {
    const payload = {
        files: req.files,
        input: req.body,
        user: req.user,
        mode: req.body.mode || 'emergency'
    };
    const result = await (0, queueService_1.enqueueFileProcessing)(payload);
    if (result && typeof result.id !== 'undefined') {
        res.status(202).json({
            success: true,
            message: 'Emergency batch accepted for processing',
            data: {
                jobId: result.id,
                status: 'queued'
            }
        });
        return;
    }
    res.status(201).json({
        success: true,
        message: 'Emergency evidence processed',
        data: result
    });
});
exports.emergency = emergency;
const travel = (0, asyncHandler_1.default)(async (req, res) => {
    const payload = {
        files: req.files,
        input: {
            ...req.body,
            mode: 'travel'
        },
        user: req.user,
        mode: 'travel'
    };
    const result = await (0, queueService_1.enqueueFileProcessing)(payload);
    if (result && typeof result.id !== 'undefined') {
        res.status(202).json({
            success: true,
            message: 'Travel batch accepted for processing',
            data: {
                jobId: result.id,
                status: 'queued'
            }
        });
        return;
    }
    res.status(201).json({
        success: true,
        message: 'Travel evidence processed',
        data: result
    });
});
exports.travel = travel;
const getEvidence = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await evidenceService_1.default.getEvidenceById({
        evidenceId: req.params.id,
        user: req.user
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.getEvidence = getEvidence;
const listUserEvidence = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await evidenceService_1.default.listEvidenceForUser({
        user: req.params.userId,
        requester: req.user,
        filters: req.query
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.listUserEvidence = listUserEvidence;
const verifyEvidence = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await evidenceService_1.default.verifyEvidenceById({
        evidenceId: req.params.id,
        user: req.user,
        req
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.verifyEvidence = verifyEvidence;
exports.default = {
    upload,
    emergency,
    travel,
    getEvidence,
    listUserEvidence,
    verifyEvidence
};

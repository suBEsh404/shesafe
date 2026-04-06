"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revoke = exports.grant = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const accessService_1 = __importDefault(require("../services/accessService"));
const grant = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await accessService_1.default.grantAccess({
        evidenceId: req.body.evidenceId,
        grantedTo: req.body.grantedTo,
        permissions: req.body.permissions,
        grantedBy: req.user,
        req
    });
    res.status(200).json({
        success: true,
        message: 'Access granted',
        data: result
    });
});
exports.grant = grant;
const revoke = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await accessService_1.default.revokeAccess({
        evidenceId: req.body.evidenceId,
        grantedTo: req.body.grantedTo,
        revokedBy: req.user,
        req
    });
    res.status(200).json({
        success: true,
        message: 'Access revoked',
        data: result
    });
});
exports.revoke = revoke;
exports.default = {
    grant,
    revoke
};

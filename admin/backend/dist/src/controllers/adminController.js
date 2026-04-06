"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.reviewControls = exports.projectActivitySummary = exports.settings = exports.exportUsers = exports.updateUserStatus = exports.inviteUser = exports.users = exports.allEvidence = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const adminService_1 = __importDefault(require("../services/adminService"));
const allEvidence = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.listAllEvidence({
        page: req.query.page,
        limit: req.query.limit,
        filters: req.query
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.allEvidence = allEvidence;
const users = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.listAdminUsers({
        page: req.query.page,
        limit: req.query.limit,
        filters: req.query
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.users = users;
const inviteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.inviteUser({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        invitedBy: req.user
    });
    res.status(201).json({
        success: true,
        message: 'Invitation created',
        data: result
    });
});
exports.inviteUser = inviteUser;
const updateUserStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.updateAuthorityStatus({
        userId: req.params.userId,
        status: req.body.status
    });
    res.status(200).json({
        success: true,
        message: 'Authority status updated',
        data: result
    });
});
exports.updateUserStatus = updateUserStatus;
const exportUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.exportAdminUsers({
        format: req.query.format,
        filters: req.query
    });
    if (result.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
        return;
    }
    res.status(200).json({
        success: true,
        data: {
            filename: result.filename,
            users: result.data
        }
    });
});
exports.exportUsers = exportUsers;
const settings = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.getAdminSettings();
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.settings = settings;
const projectActivitySummary = (0, asyncHandler_1.default)(async (_req, res) => {
    const result = await adminService_1.default.getProjectActivitySummary();
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.projectActivitySummary = projectActivitySummary;
const reviewControls = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.evaluateSecurityControls({
        notes: req.body.notes,
        reviewedBy: req.user
    });
    res.status(200).json({
        success: true,
        message: 'Security controls reviewed',
        data: result
    });
});
exports.reviewControls = reviewControls;
const generateReport = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await adminService_1.default.generateAuditReport({
        from: req.body.from,
        to: req.body.to,
        format: req.body.format,
        requestedBy: req.user
    });
    res.status(201).json({
        success: true,
        message: 'Report generated',
        data: result
    });
});
exports.generateReport = generateReport;
exports.default = {
    allEvidence,
    users,
    inviteUser,
    updateUserStatus,
    exportUsers,
    settings,
    projectActivitySummary,
    reviewControls,
    generateReport
};

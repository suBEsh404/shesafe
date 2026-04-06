import asyncHandler from '../utils/asyncHandler';
import adminService from '../services/adminService';

const allEvidence = asyncHandler(async (req, res) => {
  const result = await adminService.listAllEvidence({
    page: req.query.page,
    limit: req.query.limit,
    filters: req.query
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const users = asyncHandler(async (req, res) => {
  const result = await adminService.listAdminUsers({
    page: req.query.page,
    limit: req.query.limit,
    filters: req.query
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const inviteUser = asyncHandler(async (req, res) => {
  const result = await adminService.inviteUser({
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

const updateUserStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateAuthorityStatus({
    userId: req.params.userId,
    status: req.body.status
  });

  res.status(200).json({
    success: true,
    message: 'Authority status updated',
    data: result
  });
});

const exportUsers = asyncHandler(async (req, res) => {
  const result = await adminService.exportAdminUsers({
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

const settings = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminSettings();

  res.status(200).json({
    success: true,
    data: result
  });
});

const projectActivitySummary = asyncHandler(async (_req, res) => {
  const result = await adminService.getProjectActivitySummary();

  res.status(200).json({
    success: true,
    data: result
  });
});

const reviewControls = asyncHandler(async (req, res) => {
  const result = await adminService.evaluateSecurityControls({
    notes: req.body.notes,
    reviewedBy: req.user
  });

  res.status(200).json({
    success: true,
    message: 'Security controls reviewed',
    data: result
  });
});

const generateReport = asyncHandler(async (req, res) => {
  const result = await adminService.generateAuditReport({
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

export {
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

export default {
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


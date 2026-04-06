const asyncHandler = require('../utils/asyncHandler');
const accessService = require('../services/accessService');

const grant = asyncHandler(async (req, res) => {
  const result = await accessService.grantAccess({
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

const revoke = asyncHandler(async (req, res) => {
  const result = await accessService.revokeAccess({
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

module.exports = {
  grant,
  revoke
};

const ApiError = require('../utils/ApiError');
const AccessControl = require('../models/AccessControl');
const AccessLog = require('../models/AccessLog');
const Evidence = require('../models/Evidence');

async function logAccess({ evidenceId, accessedBy, action, req, status = 'allowed', details = {} }) {
  await AccessLog.create({
    evidenceId,
    accessedBy,
    action,
    status,
    ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
    userAgent: req?.headers?.['user-agent'] || null,
    details
  });
}

async function ensureOwnerOrAdmin(evidence, user) {
  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  if (user.role === 'admin' || user.role === 'authority') {
    return true;
  }

  if (evidence.ownerUserId && evidence.ownerUserId.toString() === user._id.toString()) {
    return true;
  }

  throw new ApiError(403, 'Insufficient permissions');
}

async function hasAccess(evidence, user, action = 'view') {
  if (!user) {
    return false;
  }

  if (user.role === 'admin' || user.role === 'authority') {
    return true;
  }

  if (evidence.ownerUserId && evidence.ownerUserId.toString() === user._id.toString()) {
    return true;
  }

  const grant = await AccessControl.findOne({
    evidenceId: evidence._id,
    grantedTo: user._id,
    status: 'active'
  });

  if (!grant) {
    return false;
  }

  return grant.permissions.includes(action);
}

async function grantAccess({ evidenceId, grantedTo, permissions, grantedBy, req }) {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new ApiError(404, 'Evidence not found');
  }

  await ensureOwnerOrAdmin(evidence, grantedBy);

  const record = await AccessControl.findOneAndUpdate(
    { evidenceId, grantedTo },
    {
      evidenceId,
      grantedTo,
      grantedBy: grantedBy._id,
      permissions,
      status: 'active',
      revokedAt: null
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('evidenceId grantedTo grantedBy');

  await logAccess({
    evidenceId,
    accessedBy: grantedBy._id,
    action: 'grant',
    req,
    details: { grantedTo, permissions }
  });

  return record;
}

async function revokeAccess({ evidenceId, grantedTo, revokedBy, req }) {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new ApiError(404, 'Evidence not found');
  }

  await ensureOwnerOrAdmin(evidence, revokedBy);

  const record = await AccessControl.findOneAndUpdate(
    { evidenceId, grantedTo, status: 'active' },
    { status: 'revoked', revokedAt: new Date() },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, 'Active access grant not found');
  }

  await logAccess({
    evidenceId,
    accessedBy: revokedBy._id,
    action: 'revoke',
    req,
    details: { grantedTo }
  });

  return record;
}

module.exports = {
  logAccess,
  ensureOwnerOrAdmin,
  hasAccess,
  grantAccess,
  revokeAccess
};

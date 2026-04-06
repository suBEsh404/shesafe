const Evidence = require('../models/Evidence');
const AccessLog = require('../models/AccessLog');
const { toEvidenceResponse } = require('./evidenceService');

async function listAllEvidence({ page = 1, limit = 25, filters = {} } = {}) {
  const query = {};

  if (filters.caseId) {
    query.caseId = filters.caseId;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.from || filters.to) {
    query.timestamp = {};
    if (filters.from) {
      query.timestamp.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.timestamp.$lte = new Date(filters.to);
    }
  }

  const [items, total] = await Promise.all([
    Evidence.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('ownerUserId', 'name email role walletAddress')
      .lean(),
    Evidence.countDocuments(query)
  ]);

  return {
    items: items.map((item) => toEvidenceResponse(item, { includeOwner: true })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

async function listAccessLogs({ page = 1, limit = 25, filters = {} } = {}) {
  const query = {};

  if (filters.action) {
    query.action = filters.action;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  const [items, total] = await Promise.all([
    AccessLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('accessedBy', 'name email role')
      .populate('evidenceId', 'caseId hash type timestamp blockchainStatus')
      .lean(),
    AccessLog.countDocuments(query)
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

module.exports = {
  listAllEvidence,
  listAccessLogs
};

// @ts-nocheck
import Evidence from '../models/Evidence';
import User from '../models/User';
import AccessLog from '../models/AccessLog';
import AdminReport from '../models/AdminReport';
import ApiError from '../utils/ApiError';

function buildEvidenceQuery(filters = {}) {
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

  return query;
}

function buildUserQuery(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return query;
}

function formatRelativeLastActive(lastActiveAt) {
  if (!lastActiveAt) {
    return 'Unknown';
  }

  const diffMs = Date.now() - new Date(lastActiveAt).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) {
    return 'Unknown';
  }

  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) {
    return 'just now';
  }
  if (mins < 60) {
    return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }

  return `${days} days ago`;
}

function toDashboardUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'active',
    lastActive: formatRelativeLastActive(user.lastActiveAt)
  };
}

function usersToCsv(users) {
  const escape = (value) => {
    const text = String(value ?? '').replace(/"/g, '""');
    return `"${text}"`;
  };

  const header = ['id', 'name', 'email', 'role', 'status', 'lastActiveAt'];
  const lines = users.map((user) => [
    user._id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.lastActiveAt ? new Date(user.lastActiveAt).toISOString() : ''
  ].map(escape).join(','));

  return [header.join(','), ...lines].join('\n');
}

function bytesToTb(bytes) {
  if (!bytes || bytes <= 0) {
    return 0;
  }
  const tebibyte = 1024 * 1024 * 1024 * 1024;
  return Number((bytes / tebibyte).toFixed(2));
}

async function listAllEvidence({ page = 1, limit = 25, filters = {} } = {}) {
  const query = buildEvidenceQuery(filters);

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
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

async function listAdminUsers({ page = 1, limit = 25, filters = {} } = {}) {
  const query = buildUserQuery(filters);

  const [items, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name email role status lastActiveAt')
      .lean(),
    User.countDocuments(query)
  ]);

  return {
    items: items.map(toDashboardUser),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

async function inviteUser({ name, email, password, role = 'authority', invitedBy }) {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    status: 'active',
    invitedBy: invitedBy?._id || null,
    invitedAt: new Date(),
    lastActiveAt: null
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    invitedAt: user.invitedAt
  };
}

async function updateAuthorityStatus({ userId, status }) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'authority') {
    throw new ApiError(400, 'Only authority accounts can be managed from this endpoint');
  }

  user.status = status;
  await user.save();

  return toDashboardUser(user.toObject());
}

async function exportAdminUsers({ format = 'csv', filters = {} } = {}) {
  const query = buildUserQuery(filters);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .select('name email role status lastActiveAt')
    .lean();

  if (format === 'json') {
    return {
      format: 'json',
      filename: `admin-users-${Date.now()}.json`,
      data: users.map(toDashboardUser)
    };
  }

  return {
    format: 'csv',
    filename: `admin-users-${Date.now()}.csv`,
    data: usersToCsv(users)
  };
}

async function evaluateSecurityControls({ notes = '', reviewedBy }) {
  const [totalUsers, pendingUsers, suspendedUsers, failedEvidence, failedRetryEvidence, pendingEvidence] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'pending' }),
    User.countDocuments({ status: 'suspended' }),
    Evidence.countDocuments({ blockchainStatus: 'FAILED' }),
    Evidence.countDocuments({ blockchainStatus: 'FAILED_RETRY' }),
    Evidence.countDocuments({ blockchainStatus: 'PENDING' })
  ]);

  let level = 'High Compliance';
  if (failedEvidence + failedRetryEvidence > 20 || suspendedUsers > 10) {
    level = 'Moderate Risk';
  }
  if (failedEvidence + failedRetryEvidence > 50 || pendingEvidence > 200) {
    level = 'Elevated Risk';
  }

  const controls = {
    accountReview: pendingUsers <= Math.max(5, Math.floor(totalUsers * 0.1)) ? 'pass' : 'warn',
    chainIntegrity: failedEvidence + failedRetryEvidence === 0 ? 'pass' : 'warn',
    uploadBacklog: pendingEvidence <= 100 ? 'pass' : 'warn'
  };

  const review = await AdminReport.create({
    reportType: 'security_review',
    requestedBy: reviewedBy._id,
    format: 'json',
    summary: {
      level,
      controls,
      notes: notes || null,
      metrics: {
        totalUsers,
        pendingUsers,
        suspendedUsers,
        failedEvidence,
        failedRetryEvidence,
        pendingEvidence
      }
    }
  });

  return {
    id: review._id,
    level,
    controls,
    reviewedAt: review.createdAt,
    notes: notes || null
  };
}

async function generateAuditReport({ from, to, format = 'json', requestedBy }) {
  const dateFilter = {};
  if (from) {
    dateFilter.$gte = new Date(from);
  }
  if (to) {
    dateFilter.$lte = new Date(to);
  }

  const evidenceFilter = Object.keys(dateFilter).length ? { timestamp: dateFilter } : {};
  const accessFilter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

  const [totalUsers, activeUsers, pendingUsers, suspendedUsers, totalEvidence, verifiedEvidence, evidencePending, evidenceFailed, totalAccessEvents, storageAgg] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'pending' }),
    User.countDocuments({ status: 'suspended' }),
    Evidence.countDocuments(evidenceFilter),
    Evidence.countDocuments({ ...evidenceFilter, blockchainStatus: 'ON_CHAIN' }),
    Evidence.countDocuments({ ...evidenceFilter, blockchainStatus: 'PENDING' }),
    Evidence.countDocuments({
      ...evidenceFilter,
      blockchainStatus: { $in: ['FAILED', 'FAILED_RETRY'] }
    }),
    AccessLog.countDocuments(accessFilter),
    Evidence.aggregate([
      { $match: evidenceFilter },
      { $unwind: { path: '$files', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, totalBytes: { $sum: { $ifNull: ['$files.size', 0] } } } }
    ])
  ]);

  const usedStorageTb = bytesToTb(storageAgg?.[0]?.totalBytes || 0);
  const summary = {
    users: {
      total: totalUsers,
      active: activeUsers,
      pending: pendingUsers,
      suspended: suspendedUsers
    },
    evidence: {
      total: totalEvidence,
      verified: verifiedEvidence,
      pending: evidencePending,
      failed: evidenceFailed
    },
    accessEvents: {
      total: totalAccessEvents
    },
    storage: {
      usedTb: usedStorageTb
    }
  };

  const report = await AdminReport.create({
    reportType: 'audit',
    requestedBy: requestedBy._id,
    format,
    rangeFrom: from ? new Date(from) : null,
    rangeTo: to ? new Date(to) : null,
    downloadName: `admin-audit-${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`,
    summary
  });

  return {
    id: report._id,
    reportType: report.reportType,
    format: report.format,
    downloadName: report.downloadName,
    range: {
      from: report.rangeFrom,
      to: report.rangeTo
    },
    summary,
    generatedAt: report.createdAt
  };
}

async function getAdminSettings() {
  const [failedEvidence, failedRetryEvidence, pendingEvidence, latestReview, storageAgg] = await Promise.all([
    Evidence.countDocuments({ blockchainStatus: 'FAILED' }),
    Evidence.countDocuments({ blockchainStatus: 'FAILED_RETRY' }),
    Evidence.countDocuments({ blockchainStatus: 'PENDING' }),
    AdminReport.findOne({ reportType: 'security_review' }).sort({ createdAt: -1 }).lean(),
    Evidence.aggregate([
      { $unwind: { path: '$files', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, totalBytes: { $sum: { $ifNull: ['$files.size', 0] } } } }
    ])
  ]);

  let securityLevel = 'High Compliance';
  if (failedEvidence + failedRetryEvidence > 20 || pendingEvidence > 100) {
    securityLevel = 'Moderate Risk';
  }
  if (failedEvidence + failedRetryEvidence > 50 || pendingEvidence > 200) {
    securityLevel = 'Elevated Risk';
  }

  const usedTb = bytesToTb(storageAgg?.[0]?.totalBytes || 0);

  return {
    apiHealth: 'All systems operational',
    storageUsed: usedTb,
    storageTotal: 100,
    securityLevel,
    latestSecurityReviewAt: latestReview?.createdAt || null
  };
}

async function getProjectActivitySummary() {
  const now = new Date();
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalAuthorities,
    totalEvidence,
    verifiedEvidence,
    pendingEvidence,
    flaggedEvidence,
    recentEvidence,
    recentAccessLogs
  ] = await Promise.all([
    User.countDocuments({ role: { $in: ['admin', 'authority'] } }),
    Evidence.countDocuments(),
    Evidence.countDocuments({ blockchainStatus: 'ON_CHAIN' }),
    Evidence.countDocuments({ blockchainStatus: 'PENDING' }),
    Evidence.countDocuments({ blockchainStatus: { $in: ['FAILED', 'FAILED_RETRY'] } }),
    Evidence.find({ timestamp: { $gte: fourteenDaysAgo } })
      .sort({ timestamp: -1 })
      .populate('ownerUserId', 'name role')
      .lean(),
    AccessLog.find({ createdAt: { $gte: fourteenDaysAgo } })
      .sort({ createdAt: -1 })
      .populate('accessedBy', 'name role')
      .populate('evidenceId', 'caseId type')
      .lean()
  ]);

  const totalActivity = recentEvidence.length + recentAccessLogs.length;
  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCounts = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0
  };

  recentEvidence.forEach((item) => {
    const stamp = new Date(item.timestamp);
    if (stamp >= sevenDaysAgo) {
      const day = weeklyDays[(stamp.getDay() + 6) % 7];
      weeklyCounts[day] += 1;
    }
  });

  recentAccessLogs.forEach((item) => {
    const stamp = new Date(item.createdAt);
    if (stamp >= sevenDaysAgo) {
      const day = weeklyDays[(stamp.getDay() + 6) % 7];
      weeklyCounts[day] += 1;
    }
  });

  const weeklyActivity = weeklyDays.map((day) => ({
    day,
    value: weeklyCounts[day],
    summary:
      weeklyCounts[day] > 0
        ? `${weeklyCounts[day]} project activities recorded.`
        : 'No project activity recorded.'
  }));

  const activityCards = [
    {
      title: 'Total Project Activity',
      value: totalActivity.toLocaleString(),
      note: 'Evidence and access events captured during the last 14 days.',
      tone: 'sky'
    },
    {
      title: 'Verified Evidence',
      value: verifiedEvidence.toLocaleString(),
      note: 'Evidence records already anchored successfully on blockchain.',
      tone: 'emerald'
    },
    {
      title: 'Pending Review',
      value: pendingEvidence.toLocaleString(),
      note: 'Evidence items still awaiting verification or blockchain confirmation.',
      tone: 'amber'
    },
    {
      title: 'Flagged Exceptions',
      value: flaggedEvidence.toLocaleString(),
      note: 'Records requiring retry, review, or manual investigation.',
      tone: 'amber'
    },
    {
      title: 'Registered Evidence',
      value: totalEvidence.toLocaleString(),
      note: 'Total evidence records stored within the system.',
      tone: 'sky'
    },
    {
      title: 'Active Authorities',
      value: totalAuthorities.toLocaleString(),
      note: 'Administrative and authority users currently part of the project.',
      tone: 'sky'
    }
  ];

  const recentActivity = [
    ...recentEvidence.slice(0, 6).map((item) => ({
      id: `evidence-${item._id}`,
      category: 'Evidence Intake',
      title: `${item.type} evidence registered`,
      subject: item.ownerUserId?.name || item.ownerAlias || 'Unknown operator',
      status: item.blockchainStatus === 'ON_CHAIN' ? 'Confirmed' : item.blockchainStatus === 'PENDING' ? 'Pending' : 'Flagged',
      note: `Case ${item.caseId}`,
      sortTime: new Date(item.timestamp).getTime(),
      time: new Date(item.timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      reference: item.hash
    })),
    ...recentAccessLogs.slice(0, 6).map((item) => ({
      id: `access-${item._id}`,
      category: 'Access Event',
      title: `${item.action} action recorded`,
      subject: item.accessedBy?.name || 'Unknown user',
      status: item.status === 'allowed' ? 'Confirmed' : item.status === 'pending' ? 'Pending' : 'Flagged',
      note: item.evidenceId?.caseId ? `Case ${item.evidenceId.caseId}` : 'Evidence access',
      sortTime: new Date(item.createdAt).getTime(),
      time: new Date(item.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      reference: item.evidenceId?._id?.toString?.() || 'Access log'
    }))
  ]
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, 8)
    .map(({ sortTime, ...item }) => item);

  return {
    activityCards,
    weeklyActivity,
    recentActivity
  };
}

export {
  listAllEvidence,
  listAdminUsers,
  inviteUser,
  updateAuthorityStatus,
  exportAdminUsers,
  getAdminSettings,
  getProjectActivitySummary,
  evaluateSecurityControls,
  generateAuditReport
};

export default {
  listAllEvidence,
  listAdminUsers,
  inviteUser,
  updateAuthorityStatus,
  exportAdminUsers,
  getAdminSettings,
  getProjectActivitySummary,
  evaluateSecurityControls,
  generateAuditReport
};


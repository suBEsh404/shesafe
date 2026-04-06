const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/adminService');

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

const accessLogs = asyncHandler(async (req, res) => {
  const result = await adminService.listAccessLogs({
    page: req.query.page,
    limit: req.query.limit,
    filters: req.query
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  allEvidence,
  accessLogs
};

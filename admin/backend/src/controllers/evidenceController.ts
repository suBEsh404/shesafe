import asyncHandler from '../utils/asyncHandler';
import evidenceService from '../services/evidenceService';
import { enqueueFileProcessing } from '../services/queueService';

const upload = asyncHandler(async (req, res) => {
  const result = await evidenceService.uploadEvidence({
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

const emergency = asyncHandler(async (req, res) => {
  const payload = {
    files: req.files,
    input: req.body,
    user: req.user,
    mode: req.body.mode || 'emergency'
  };

  try {
    const result = await evidenceService.ingestBatchSession(payload);
    res.status(201).json({
      success: true,
      message: 'Emergency evidence processed',
      data: result
    });
    return;
  } catch (error) {
    const queued = await enqueueFileProcessing(payload);
    if (queued && typeof queued.id !== 'undefined') {
      res.status(202).json({
        success: true,
        message: 'Emergency batch accepted for processing',
        data: {
          jobId: queued.id,
          status: 'queued'
        }
      });
      return;
    }

    throw error;
  }
});

const emergencyFinalize = asyncHandler(async (req, res) => {
  const result = await evidenceService.ingestBatchSession({
    files: [],
    input: {
      ...req.body,
      mode: 'emergency',
      type: 'emergency',
      isFinal: true
    },
    user: req.user,
    mode: 'emergency'
  });

  res.status(200).json({
    success: true,
    message: 'Emergency session finalized',
    data: result
  });
});

const travel = asyncHandler(async (req, res) => {
  const payload = {
    files: req.files,
    input: {
      ...req.body,
      mode: 'travel'
    },
    user: req.user,
    mode: 'travel'
  };

  const result = await enqueueFileProcessing(payload);

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

const travelCheckpoint = asyncHandler(async (req, res) => {
  const result = await evidenceService.recordTravelCheckpoint({
    input: req.body,
    user: req.user
  });

  res.status(200).json({
    success: true,
    message: 'Travel checkpoint recorded',
    data: result
  });
});

const getEvidence = asyncHandler(async (req, res) => {
  const result = await evidenceService.getEvidenceById({
    evidenceId: req.params.id,
    user: req.user
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const listUserEvidence = asyncHandler(async (req, res) => {
  const result = await evidenceService.listEvidenceForUser({
    user: req.params.userId,
    requester: req.user,
    filters: req.query
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const verifyEvidence = asyncHandler(async (req, res) => {
  const result = await evidenceService.verifyEvidenceById({
    evidenceId: req.params.id,
    user: req.user,
    req
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

export {
  upload,
  emergency,
  emergencyFinalize,
  travel,
  travelCheckpoint,
  getEvidence,
  listUserEvidence,
  verifyEvidence
};

export default {
  upload,
  emergency,
  emergencyFinalize,
  travel,
  travelCheckpoint,
  getEvidence,
  listUserEvidence,
  verifyEvidence
};


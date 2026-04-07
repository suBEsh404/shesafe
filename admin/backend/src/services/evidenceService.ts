// @ts-nocheck
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';
import Evidence from '../models/Evidence';
import EmergencySession from '../models/EmergencySession';
import RetryJob from '../models/RetryJob';
import AccessControl from '../models/AccessControl';
import AccessLog from '../models/AccessLog';
import { encryptBuffer, decryptBuffer } from './encryptionService';
import { uploadEncryptedBuffer, downloadBufferFromUrl, deleteStoredFile } from './storageService';
import { bufferHash, buildEvidenceHash, sha256Hex } from './hashService';
import blockchainService from './blockchainService';
import { enqueueBlockchainWrite } from './queueService';
import { hasAccess, logAccess } from './accessService';
import { isConfigured as blockchainConfigured } from './blockchainService';
import { emergencyBatchSeconds, travelBatchSeconds, encryptFilesBeforeUpload } from '../config/env';

function buildOwnerRef(user, input) {
  if (user && user._id) {
    return user._id.toString();
  }

  if (input?.ownerAlias) {
    return String(input.ownerAlias);
  }

  if (input?.walletAddress) {
    return String(input.walletAddress).toLowerCase();
  }

  return '';
}

function normalizeFiles(files) {
  if (!files) {
    return [];
  }

  return (Array.isArray(files) ? files : [files])
    .filter(Boolean)
    .map((file) => ({
      ...file,
      buffer: Buffer.isBuffer(file.buffer)
        ? file.buffer
        : file.buffer && file.buffer.type === 'Buffer'
          ? Buffer.from(file.buffer.data)
          : file.buffer
    }));
}

function toEvidenceResponse(evidence, { includeOwner = false } = {}) {
  if (!evidence) {
    return null;
  }

  const response = {
    id: evidence._id,
    caseId: evidence.caseId,
    type: evidence.type,
    timestamp: evidence.timestamp,
    hash: evidence.hash,
    blockchainTxHash: evidence.blockchainTxHash,
    blockchainStatus: evidence.blockchainStatus,
    sessionId: evidence.sessionId,
    isAnonymous: evidence.isAnonymous,
    fileUrls: evidence.fileUrls || [],
    cloudinaryIds: evidence.cloudinaryIds || [],
    files: evidence.files || [],
    metadata: evidence.metadata || {},
    createdAt: evidence.createdAt,
    updatedAt: evidence.updatedAt
  };

  if (includeOwner && !evidence.isAnonymous) {
    response.ownerUserId = evidence.ownerUserId;
    response.walletAddress = evidence.walletAddress || null;
  }

  if (evidence.isAnonymous) {
    response.ownerAlias = evidence.ownerAlias || null;
    response.walletAddress = evidence.walletAddress || null;
  }

  return response;
}

async function processUploadedFiles(files, { caseId, type, sessionId = null, user = null, input = {}, folderPrefix = '' }) {
  const normalizedFiles = normalizeFiles(files);
  if (!normalizedFiles.length) {
    throw new ApiError(400, 'At least one file is required');
  }

  const ownerRef = buildOwnerRef(user, input);
  const evidenceTimestamp = new Date();
  const uploadedFiles = [];
  const cleanupTargets = [];

  try {
    for (let index = 0; index < normalizedFiles.length; index += 1) {
      const file = normalizedFiles[index];
      if (!file.buffer) {
        throw new ApiError(400, 'Uploaded file buffer is missing');
      }

      const originalHash = bufferHash(file.buffer);
      const encrypted = encryptFilesBeforeUpload ? encryptBuffer(file.buffer) : null;
      const uploadBuffer = encrypted ? encrypted.encrypted : file.buffer;
      const folder = folderPrefix ? `${folderPrefix}/${caseId}` : `evidence/${caseId}`;
      const uploadName = `${Date.now()}-${index + 1}`;
      const uploaded = await uploadEncryptedBuffer({
        buffer: uploadBuffer,
        filename: uploadName,
        mimeType: file.mimetype,
        folder
      });

      cleanupTargets.push({ publicId: uploaded.publicId, provider: uploaded.provider });

      uploadedFiles.push({
        order: index + 1,
        label: file.originalname,
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
        provider: uploaded.provider,
        mimeType: file.mimetype,
        size: file.size || file.buffer.length,
        isEncrypted: Boolean(encrypted),
        iv: encrypted?.iv || null,
        authTag: encrypted?.authTag || null,
        originalHash
      });
    }

    const combinedHash = buildEvidenceHash({
      caseId,
      type,
      timestamp: '',
      fileHashes: uploadedFiles.map((item) => item.originalHash),
      ownerRef,
      sessionId: sessionId || ''
    });

    const evidence = await Evidence.create({
      ownerUserId: user?._id || null,
      ownerAlias: input?.ownerAlias || null,
      walletAddress: input?.walletAddress ? String(input.walletAddress).toLowerCase() : user?.walletAddress || null,
      caseId,
      type,
      timestamp: evidenceTimestamp,
      files: uploadedFiles,
      fileUrls: uploadedFiles.map((item) => item.url),
      cloudinaryIds: uploadedFiles.map((item) => item.publicId),
      hash: combinedHash,
      blockchainStatus: 'PENDING',
      sessionId,
      metadata: input?.metadata || {},
      isAnonymous: Boolean(input?.isAnonymous)
    });

    const blockchainResult = await scheduleBlockchainWrite({
      evidenceId: evidence._id.toString(),
      evidenceHash: combinedHash,
      timestamp: evidenceTimestamp.getTime(),
      caseId
    });

    if (blockchainResult && blockchainResult.txHash) {
      evidence.blockchainTxHash = blockchainResult.txHash;
      evidence.blockchainStatus = 'ON_CHAIN';
      await Evidence.updateOne(
        { _id: evidence._id },
        {
          $set: {
            blockchainTxHash: blockchainResult.txHash,
            blockchainStatus: 'ON_CHAIN'
          }
        }
      );
    }

    return evidence;
  } catch (error) {
    if (cleanupTargets.length) {
      await Promise.allSettled(
        cleanupTargets.map((item) => deleteStoredFile(item.publicId, item.provider))
      );
    }

    throw error;
  }
}

async function scheduleBlockchainWrite(payload) {
  try {
    if (blockchainConfigured()) {
      const job = await enqueueBlockchainWrite(payload);
      if (job && typeof job.id !== 'undefined') {
        return job;
      }
    }

    const blockchainResult = await blockchainService.storeEvidenceHash({
      evidenceHash: payload.evidenceHash,
      timestamp: payload.timestamp,
      caseId: payload.caseId
    });

    await Evidence.updateOne(
      { _id: payload.evidenceId },
      {
        $set: {
          blockchainTxHash: blockchainResult.txHash,
          blockchainStatus: 'ON_CHAIN'
        }
      }
    );

    return blockchainResult;
  } catch (error) {
    await Evidence.updateOne(
      { _id: payload.evidenceId },
      {
        $set: {
          blockchainStatus: 'FAILED_RETRY'
        }
      }
    );

    await RetryJob.create({
      jobType: 'blockchain-write',
      payload,
      status: 'queued',
      attempts: 0,
      nextRetryAt: new Date(Date.now() + 5 * 60 * 1000),
      lastError: error.message
    });

    return null;
  }
}

async function uploadEvidence({ files, input, user }) {
  const evidence = await processUploadedFiles(files, {
    caseId: input.caseId,
    type: input.type,
    user,
    input,
    folderPrefix: 'evidence'
  });

  return toEvidenceResponse(evidence, { includeOwner: true });
}

async function ingestBatchSession({ files, input, user, mode = 'emergency' }) {
  const normalizedFiles = normalizeFiles(files);
  const sessionId = input.sessionId || `session_${Date.now()}`;
  const caseId = input.caseId || sessionId;

  if (!normalizedFiles.length) {
    if (mode === 'emergency' && input?.isFinal) {
      const session = await EmergencySession.findOne({ sessionId });
      if (!session || !session.chunks?.length) {
        throw new ApiError(400, 'No buffered emergency chunks found to finalize');
      }

      if (session.status === 'sealed') {
        const evidence = await Evidence.findOne({ sessionId }).sort({ createdAt: -1 });
        return {
          status: 'sealed',
          evidence: evidence ? toEvidenceResponse(evidence, { includeOwner: true }) : null,
          sessionId,
          chunkCount: session.chunks.length
        };
      }

      session.lastActivityAt = new Date();
    } else {
      throw new ApiError(400, 'At least one file is required for emergency or travel batching');
    }
  }

  const session = await EmergencySession.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        userId: user?._id || null,
        sessionId
      },
      $set: {
        caseId,
        mode,
        lastActivityAt: new Date()
      }
    },
    { upsert: true, new: true }
  );

  const folderPrefix = mode === 'travel' ? 'travel' : 'emergency';
  const existingSequences = session.chunks.length;
  const uploadedChunks = [];
  const location = input?.location && typeof input.location === 'object'
    ? input.location
    : {
      latitude: input?.latitude,
      longitude: input?.longitude,
      accuracy: input?.accuracy
    };

  for (let index = 0; index < normalizedFiles.length; index += 1) {
    const file = normalizedFiles[index];
    const originalHash = bufferHash(file.buffer);
    const encrypted = encryptFilesBeforeUpload ? encryptBuffer(file.buffer) : null;
    const sequence = existingSequences + index + 1;
    const capturedAt = input?.chunkTimestamp ? new Date(input.chunkTimestamp) : new Date();
    const locationPayload = JSON.stringify({
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      accuracy: location?.accuracy ?? null,
      capturedAt: capturedAt.toISOString(),
      sessionId,
      sequence
    });
    const locationHash = sha256Hex(locationPayload);
    const videoHash = originalHash;
    const audioHash = input?.audioHash || sha256Hex(`${originalHash}:embedded-audio`);
    const chunkHash = sha256Hex(`${videoHash}:${audioHash}:${locationHash}:${sessionId}:${sequence}`);
    const uploadBuffer = encrypted ? encrypted.encrypted : file.buffer;
    const upload = await uploadEncryptedBuffer({
      buffer: uploadBuffer,
      filename: `${sessionId}-${Date.now()}-${index + 1}`,
      mimeType: file.mimetype,
      folder: `${folderPrefix}/${sessionId}`
    });

    uploadedChunks.push({
      sequence,
      url: upload.secureUrl,
      publicId: upload.publicId,
      provider: upload.provider,
      mimeType: file.mimetype,
      size: file.size || file.buffer.length,
      isEncrypted: Boolean(encrypted),
      iv: encrypted?.iv || null,
      authTag: encrypted?.authTag || null,
      originalHash,
      location,
      locationHash,
      videoHash,
      audioHash,
      chunkHash,
      chunkIndex: input?.chunkIndex || sequence,
      capturedAt
    });
  }

  if (uploadedChunks.length) {
    session.chunks.push(...uploadedChunks);
  }
  session.lastActivityAt = new Date();

  const elapsedSeconds = (Date.now() - new Date(session.startedAt).getTime()) / 1000;
  const requiredWindow = session.mode === 'travel' ? travelBatchSeconds : emergencyBatchSeconds;
  // For SOS emergency mode, keep buffering/storing chunk hashes until user stops recording (isFinal=true).
  const shouldSeal = session.mode === 'emergency'
    ? Boolean(input.isFinal)
    : Boolean(input.isFinal || elapsedSeconds >= requiredWindow);

  if (!shouldSeal) {
    await session.save();
    return {
      status: 'buffering',
      sessionId,
      chunkCount: session.chunks.length,
      sealed: false
    };
  }

  const combinedHash = buildEvidenceHash({
    caseId: session.caseId,
    type: mode,
    timestamp: '',
    fileHashes: session.chunks.map((chunk) => chunk.originalHash),
    ownerRef: buildOwnerRef(user, input),
    sessionId
  });

  const evidence = await Evidence.create({
    ownerUserId: user?._id || null,
    ownerAlias: input?.ownerAlias || null,
    walletAddress: input?.walletAddress ? String(input.walletAddress).toLowerCase() : user?.walletAddress || null,
    caseId: session.caseId,
    type: mode,
    timestamp: new Date(),
    files: session.chunks.map((chunk, index) => ({
      order: index + 1,
      label: `batch-${index + 1}`,
      url: chunk.url,
      publicId: chunk.publicId,
      provider: chunk.provider,
      mimeType: chunk.mimeType,
      size: chunk.size,
      isEncrypted: Boolean(chunk.isEncrypted),
      iv: chunk.iv,
      authTag: chunk.authTag,
      originalHash: chunk.originalHash
    })),
    fileUrls: session.chunks.map((chunk) => chunk.url),
    cloudinaryIds: session.chunks.map((chunk) => chunk.publicId),
    hash: combinedHash,
    blockchainStatus: 'PENDING',
    sessionId,
    metadata: input?.metadata || {},
    isAnonymous: Boolean(input?.isAnonymous)
  });

  session.hash = combinedHash;
  session.finalizedAt = new Date();
  session.status = 'sealed';
  session.blockchainTxHash = null;
  await session.save();

  const blockchainResult = await scheduleBlockchainWrite({
    evidenceId: evidence._id.toString(),
    evidenceHash: combinedHash,
    timestamp: evidence.timestamp.getTime(),
    caseId: evidence.caseId
  });

  if (blockchainResult && blockchainResult.txHash) {
    evidence.blockchainTxHash = blockchainResult.txHash;
    evidence.blockchainStatus = 'ON_CHAIN';
    session.blockchainTxHash = blockchainResult.txHash;
    await session.save();
  }

  return {
    status: 'sealed',
    evidence: toEvidenceResponse(evidence, { includeOwner: true }),
    sessionId,
    chunkCount: session.chunks.length
  };
}

async function recordTravelCheckpoint({ input, user }) {
  const sessionId = input.sessionId;
  const caseId = input.caseId;

  const session = await EmergencySession.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        userId: user?._id || null,
        sessionId,
        mode: 'travel'
      },
      $set: {
        caseId,
        mode: 'travel',
        lastActivityAt: new Date()
      }
    },
    { upsert: true, new: true }
  );

  const checkpoint = {
    latitude: input.location?.latitude,
    longitude: input.location?.longitude,
    accuracy: input.location?.accuracy,
    capturedAt: new Date().toISOString()
  };

  const metadata = session.metadata && typeof session.metadata === 'object'
    ? session.metadata
    : {};
  const checkpoints = Array.isArray(metadata.checkpoints)
    ? metadata.checkpoints
    : [];

  checkpoints.push(checkpoint);
  session.metadata = {
    ...metadata,
    checkpoints,
    ...input.metadata
  };

  if (input.isFinal) {
    session.status = 'sealed';
    session.finalizedAt = new Date();
  }

  await session.save();

  return {
    sessionId,
    caseId,
    status: input.isFinal ? 'sealed' : 'buffering',
    checkpointCount: checkpoints.length,
    latestCheckpoint: checkpoint
  };
}

async function getEvidenceById({ evidenceId, user }) {
  const evidence = await Evidence.findById(evidenceId).populate('ownerUserId', 'name email role walletAddress');
  if (!evidence) {
    throw new ApiError(404, 'Evidence not found');
  }

  const allowed = await hasAccess(evidence, user, 'view');
  if (!allowed) {
    throw new ApiError(403, 'You are not allowed to view this evidence');
  }

  await logAccess({
    evidenceId: evidence._id,
    accessedBy: user._id,
    action: 'view',
    req: null,
    details: { evidenceHash: evidence.hash }
  });

  return toEvidenceResponse(evidence, { includeOwner: true });
}

async function listEvidenceForUser({ user, requester, filters = {} }) {
  const query = {};

  if (requester.role !== 'admin' && requester._id.toString() !== user) {
    throw new ApiError(403, 'You can only access your own evidence');
  }

  if (mongoose.Types.ObjectId.isValid(user)) {
    query.ownerUserId = user;
  } else {
    query.ownerAlias = user;
  }

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

  const page = Math.max(1, Number(filters.page || 1));
  const limit = Math.min(100, Math.max(1, Number(filters.limit || 25)));

  const [items, total] = await Promise.all([
    Evidence.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Evidence.countDocuments(query)
  ]);

  return {
    items: items.map((item) => toEvidenceResponse(item, { includeOwner: false })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

async function verifyEvidenceById({ evidenceId, user, req }) {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new ApiError(404, 'Evidence not found');
  }

  const allowed = await hasAccess(evidence, user, 'view');
  if (!allowed) {
    throw new ApiError(403, 'You are not allowed to verify this evidence');
  }

  const recalculatedHashes = [];
  for (const file of evidence.files) {
    const storedBuffer = await downloadBufferFromUrl(file.url);
    if (file.isEncrypted && file.iv && file.authTag) {
      const decryptedBuffer = decryptBuffer(storedBuffer, file.iv, file.authTag);
      recalculatedHashes.push(bufferHash(decryptedBuffer));
    } else {
      recalculatedHashes.push(bufferHash(storedBuffer));
    }
  }

  const recomputedHash = buildEvidenceHash({
    caseId: evidence.caseId,
    type: evidence.type,
    timestamp: '',
    fileHashes: recalculatedHashes,
    ownerRef: evidence.isAnonymous ? (evidence.ownerAlias || evidence.walletAddress || '') : evidence.ownerUserId ? evidence.ownerUserId.toString() : '',
    sessionId: evidence.sessionId || ''
  });

  const localMatch = recomputedHash === evidence.hash && recalculatedHashes.every((hash, index) => hash === evidence.files[index].originalHash);

  let chainMatch = false;
  if (blockchainConfigured()) {
    try {
      chainMatch = await blockchainService.verifyEvidenceHash(evidence.hash);
    } catch (error) {
      chainMatch = false;
    }
  }

  await logAccess({
    evidenceId: evidence._id,
    accessedBy: user._id,
    action: 'verify',
    req,
    details: { localMatch, chainMatch }
  });

  return {
    evidenceId: evidence._id,
    status: localMatch && chainMatch ? 'VALID' : 'INVALID',
    localMatch,
    chainMatch,
    recalculatedHash: recomputedHash,
    blockchainHash: evidence.hash
  };
}

async function recordBlockchainResult({ evidenceId, txHash }) {
  await Evidence.updateOne(
    { _id: evidenceId },
    {
      $set: {
        blockchainTxHash: txHash,
        blockchainStatus: 'ON_CHAIN'
      }
    }
  );
}

async function retryBlockchainWrite(payload) {
  const result = await blockchainService.storeEvidenceHash({
    evidenceHash: payload.evidenceHash,
    timestamp: payload.timestamp,
    caseId: payload.caseId
  });

  await recordBlockchainResult({ evidenceId: payload.evidenceId, txHash: result.txHash });
  return result;
}

export {
  processUploadedFiles,
  uploadEvidence,
  ingestBatchSession,
  recordTravelCheckpoint,
  getEvidenceById,
  listEvidenceForUser,
  verifyEvidenceById,
  recordBlockchainResult,
  retryBlockchainWrite,
  toEvidenceResponse
};

export default {
  processUploadedFiles,
  uploadEvidence,
  ingestBatchSession,
  recordTravelCheckpoint,
  getEvidenceById,
  listEvidenceForUser,
  verifyEvidenceById,
  recordBlockchainResult,
  retryBlockchainWrite,
  toEvidenceResponse
};


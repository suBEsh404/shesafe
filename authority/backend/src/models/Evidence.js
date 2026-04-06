const mongoose = require('mongoose');

const evidenceFileSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      enum: ['cloudinary', 'ipfs'],
      default: 'cloudinary'
    },
    mimeType: String,
    size: Number,
    isEncrypted: {
      type: Boolean,
      default: false
    },
    iv: {
      type: String,
      default: null
    },
    authTag: {
      type: String,
      default: null
    },
    originalHash: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const evidenceSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    ownerAlias: {
      type: String,
      trim: true,
      index: true,
      sparse: true
    },
    walletAddress: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true
    },
    caseId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: ['emergency', 'report', 'travel'],
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    files: {
      type: [evidenceFileSchema],
      default: []
    },
    fileUrls: {
      type: [String],
      default: []
    },
    cloudinaryIds: {
      type: [String],
      default: []
    },
    hash: {
      type: String,
      required: true,
      index: true
    },
    blockchainTxHash: {
      type: String,
      default: null,
      index: true
    },
    blockchainStatus: {
      type: String,
      enum: ['PENDING', 'ON_CHAIN', 'FAILED_RETRY', 'FAILED'],
      default: 'PENDING'
    },
    sessionId: {
      type: String,
      trim: true,
      index: true,
      sparse: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

evidenceSchema.index({ caseId: 1, timestamp: -1 });
evidenceSchema.index({ ownerUserId: 1, timestamp: -1 });
evidenceSchema.index({ hash: 1, caseId: 1 });

module.exports = mongoose.model('Evidence', evidenceSchema);

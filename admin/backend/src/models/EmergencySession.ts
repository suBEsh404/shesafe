import mongoose from 'mongoose';

const emergencyChunkSchema = new mongoose.Schema(
  {
    sequence: {
      type: Number,
      required: true
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
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    },
    capturedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const emergencySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    caseId: {
      type: String,
      trim: true,
      index: true
    },
    mode: {
      type: String,
      enum: ['emergency', 'travel'],
      default: 'emergency',
      index: true
    },
    chunks: {
      type: [emergencyChunkSchema],
      default: []
    },
    status: {
      type: String,
      enum: ['open', 'sealed', 'synced', 'failed'],
      default: 'open',
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastActivityAt: {
      type: Date,
      default: Date.now
    },
    finalizedAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    hash: {
      type: String,
      default: null,
      index: true
    },
    blockchainTxHash: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const EmergencySession = mongoose.model('EmergencySession', emergencySessionSchema);

export default EmergencySession;


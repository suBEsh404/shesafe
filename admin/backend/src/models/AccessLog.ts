import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence',
      required: true,
      index: true
    },
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      enum: ['view', 'download', 'share', 'grant', 'revoke', 'verify'],
      required: true,
      index: true
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['allowed', 'blocked', 'pending'],
      default: 'allowed'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

export default AccessLog;


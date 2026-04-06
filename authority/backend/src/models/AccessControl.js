const mongoose = require('mongoose');

const accessControlSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence',
      required: true,
      index: true
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    grantedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    permissions: {
      type: [String],
      enum: ['view', 'download', 'share'],
      default: ['view']
    },
    status: {
      type: String,
      enum: ['active', 'revoked'],
      default: 'active',
      index: true
    },
    revokedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

accessControlSchema.index({ evidenceId: 1, grantedTo: 1 }, { unique: true });

module.exports = mongoose.model('AccessControl', accessControlSchema);

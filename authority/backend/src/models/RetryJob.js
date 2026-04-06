const mongoose = require('mongoose');

const retryJobSchema = new mongoose.Schema(
  {
    jobType: {
      type: String,
      required: true,
      index: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'succeeded', 'failed'],
      default: 'queued',
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    nextRetryAt: {
      type: Date,
      default: null,
      index: true
    },
    lastError: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RetryJob', retryJobSchema);

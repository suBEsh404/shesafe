import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    alertType: {
      type: String,
      enum: ['emergency', 'live-location'],
      default: 'emergency',
      index: true
    },
    sessionId: {
      type: String,
      default: null,
      index: true
    },
    message: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['queued', 'sent', 'failed'],
      default: 'sent',
      index: true
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    },
    notifiedContacts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'TrustedContact',
      default: []
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

emergencyAlertSchema.index({ ownerUserId: 1, createdAt: -1 });

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

export default EmergencyAlert;

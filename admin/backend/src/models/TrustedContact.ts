import mongoose from 'mongoose';

const trustedContactSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      trim: true,
      default: 'Trusted Contact'
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },
    isSharing: {
      type: Boolean,
      default: true,
      index: true
    },
    emergencyPriority: {
      type: Number,
      default: 1
    },
    notes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

trustedContactSchema.index({ ownerUserId: 1, createdAt: -1 });

const TrustedContact = mongoose.model('TrustedContact', trustedContactSchema);

export default TrustedContact;

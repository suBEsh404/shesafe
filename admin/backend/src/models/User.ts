import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'authority', 'admin'],
      default: 'user'
    },
    walletAddress: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'active',
      index: true
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    invitedAt: {
      type: Date,
      default: null
    },
    expoPushTokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
            trim: true
          },
          deviceId: {
            type: String,
            default: null,
            trim: true
          },
          platform: {
            type: String,
            enum: ['ios', 'android', 'web', 'unknown'],
            default: 'unknown'
          },
          lastRegisteredAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;


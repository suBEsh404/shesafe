"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    invitedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function preSave(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    return next();
});
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;

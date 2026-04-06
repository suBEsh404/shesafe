"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refreshTokens = refreshTokens;
exports.logoutUser = logoutUser;
exports.sanitizeUser = sanitizeUser;
exports.issueTokenPair = issueTokenPair;
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const User_1 = __importDefault(require("../models/User"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const tokenService_1 = require("./tokenService");
function buildTokenPayload(user) {
    return {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress || null
    };
}
async function issueTokenPair(user) {
    const payload = buildTokenPayload(user);
    const accessToken = (0, tokenService_1.signAccessToken)(payload);
    const jti = crypto_1.default.randomUUID();
    const refreshToken = (0, tokenService_1.signRefreshToken)({
        ...payload,
        jti
    });
    const decodedRefresh = (0, tokenService_1.verifyRefreshToken)(refreshToken);
    const tokenHash = (0, tokenService_1.hashToken)(refreshToken);
    await RefreshToken_1.default.create({
        userId: user._id,
        jti: decodedRefresh.jti || jti,
        tokenHash,
        expiresAt: new Date(decodedRefresh.exp * 1000)
    });
    return {
        accessToken,
        refreshToken,
        expiresAt: decodedRefresh.exp
    };
}
async function registerUser(input) {
    const existingUser = await User_1.default.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
        throw new ApiError_1.default(409, 'Email is already registered');
    }
    const user = await User_1.default.create({
        name: input.name,
        email: input.email.toLowerCase(),
        password: input.password,
        role: input.role || 'user',
        walletAddress: input.walletAddress ? String(input.walletAddress).toLowerCase() : undefined,
        isAnonymous: Boolean(input.isAnonymous),
        status: 'active',
        lastActiveAt: new Date()
    });
    const tokens = await issueTokenPair(user);
    return {
        user: sanitizeUser(user),
        ...tokens
    };
}
async function loginUser({ email, password }) {
    const user = await User_1.default.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        throw new ApiError_1.default(401, 'Invalid credentials');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(401, 'Invalid credentials');
    }
    const tokens = await issueTokenPair(user);
    user.lastActiveAt = new Date();
    if (!user.status) {
        user.status = 'active';
    }
    await user.save();
    return {
        user: sanitizeUser(user),
        ...tokens
    };
}
async function refreshTokens(refreshToken) {
    const decoded = (0, tokenService_1.verifyRefreshToken)(refreshToken);
    const tokenHash = (0, tokenService_1.hashToken)(refreshToken);
    const storedToken = await RefreshToken_1.default.findOne({
        userId: decoded.sub,
        tokenHash,
        revokedAt: null
    });
    if (!storedToken) {
        throw new ApiError_1.default(401, 'Refresh token is invalid or revoked');
    }
    const user = await User_1.default.findById(decoded.sub);
    if (!user) {
        throw new ApiError_1.default(401, 'User not found');
    }
    storedToken.revokedAt = new Date();
    await storedToken.save();
    return issueTokenPair(user);
}
async function logoutUser(refreshToken) {
    if (!refreshToken) {
        return { revoked: false };
    }
    const tokenHash = (0, tokenService_1.hashToken)(refreshToken);
    await RefreshToken_1.default.updateOne({ tokenHash, revokedAt: null }, { $set: { revokedAt: new Date() } });
    return { revoked: true };
}
function sanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        walletAddress: user.walletAddress || null,
        isAnonymous: user.isAnonymous,
        lastActiveAt: user.lastActiveAt || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
exports.default = {
    registerUser,
    loginUser,
    refreshTokens,
    logoutUser,
    sanitizeUser,
    issueTokenPair
};

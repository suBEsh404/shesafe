const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } = require('./tokenService');

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
  const accessToken = signAccessToken(payload);
  const jti = crypto.randomUUID();
  const refreshToken = signRefreshToken({
    ...payload,
    jti
  });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
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
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role || 'user',
    walletAddress: input.walletAddress ? String(input.walletAddress).toLowerCase() : undefined,
    isAnonymous: Boolean(input.isAnonymous)
  });

  const tokens = await issueTokenPair(user);

  return {
    user: sanitizeUser(user),
    ...tokens
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const tokens = await issueTokenPair(user);

  return {
    user: sanitizeUser(user),
    ...tokens
  };
}

async function refreshTokens(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);
  const storedToken = await RefreshToken.findOne({
    userId: decoded.sub,
    tokenHash,
    revokedAt: null
  });

  if (!storedToken) {
    throw new ApiError(401, 'Refresh token is invalid or revoked');
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  return issueTokenPair(user);
}

async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return { revoked: false };
  }

  const tokenHash = hashToken(refreshToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return { revoked: true };
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress || null,
    isAnonymous: user.isAnonymous,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  sanitizeUser,
  issueTokenPair
};

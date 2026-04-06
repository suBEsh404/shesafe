const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { accessTokenSecret, refreshTokenSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshTokenSecret);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken
};

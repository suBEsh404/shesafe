const crypto = require('crypto');
const { encryptionKey } = require('../config/env');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    algorithm: ALGORITHM
  };
}

function decryptBuffer(buffer, ivHex, authTagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(buffer), decipher.final()]);
}

module.exports = {
  encryptBuffer,
  decryptBuffer,
  ALGORITHM
};

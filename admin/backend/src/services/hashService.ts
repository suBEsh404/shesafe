import crypto from 'crypto';

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === 'object' && !(value instanceof Buffer)) {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = sortValue(value[key]);
        return accumulator;
      }, {});
  }

  return value;
}

function stableStringify(value) {
  return JSON.stringify(sortValue(value));
}

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function bufferHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function buildEvidenceHash({ caseId = '', type = '', timestamp = new Date().toISOString(), fileHashes = [], ownerRef = '', sessionId = '' }) {
  const payload = stableStringify({
    caseId,
    type,
    timestamp,
    fileHashes: [...fileHashes].sort(),
    ownerRef,
    sessionId
  });

  return sha256Hex(payload);
}

export {
  stableStringify,
  sha256Hex,
  bufferHash,
  buildEvidenceHash
};


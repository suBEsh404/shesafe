"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableStringify = stableStringify;
exports.sha256Hex = sha256Hex;
exports.bufferHash = bufferHash;
exports.buildEvidenceHash = buildEvidenceHash;
const crypto_1 = __importDefault(require("crypto"));
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
    return crypto_1.default.createHash('sha256').update(input).digest('hex');
}
function bufferHash(buffer) {
    return crypto_1.default.createHash('sha256').update(buffer).digest('hex');
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const env_1 = require("../config/env");
const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/webm',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);
const storage = multer_1.default.memoryStorage();
function fileFilter(req, file, callback) {
    const mimeType = file.mimetype || '';
    if (allowedMimeTypes.has(mimeType) || mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
        callback(null, true);
        return;
    }
    callback(new ApiError_1.default(400, `Unsupported file type: ${mimeType || 'unknown'}`));
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: env_1.maxFileSizeBytes,
        files: 20
    }
});
exports.default = upload;

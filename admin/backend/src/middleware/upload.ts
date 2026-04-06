import multer from 'multer';
import ApiError from '../utils/ApiError';
import { maxFileSizeBytes } from '../config/env';

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

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const mimeType = file.mimetype || '';

  if (allowedMimeTypes.has(mimeType) || mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
    callback(null, true);
    return;
  }

  callback(new ApiError(400, `Unsupported file type: ${mimeType || 'unknown'}`));
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeBytes,
    files: 20
  }
});

export default upload;


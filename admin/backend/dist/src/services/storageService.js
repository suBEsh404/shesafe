"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEncryptedBuffer = uploadEncryptedBuffer;
exports.deleteStoredFile = deleteStoredFile;
exports.downloadBufferFromUrl = downloadBufferFromUrl;
const stream_1 = require("stream");
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
if (env_1.cloudinary.cloudName && env_1.cloudinary.apiKey && env_1.cloudinary.apiSecret) {
    cloudinary_1.v2.config({
        cloud_name: env_1.cloudinary.cloudName,
        api_key: env_1.cloudinary.apiKey,
        api_secret: env_1.cloudinary.apiSecret,
        secure: true
    });
}
function bufferToStream(buffer) {
    return stream_1.Readable.from(buffer);
}
function uploadBufferToCloudinary({ buffer, filename, folder, resourceType = 'auto' }) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: folder || env_1.cloudinary.folder,
            resource_type: resourceType,
            public_id: filename,
            overwrite: false,
            use_filename: true,
            unique_filename: true
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
        bufferToStream(buffer).pipe(uploadStream);
    });
}
async function uploadEncryptedBuffer({ buffer, filename, mimeType, folder }) {
    if (env_1.storageProvider === 'ipfs' || env_1.useIpfs) {
        if (!env_1.ipfs.apiUrl) {
            throw new ApiError_1.default(500, 'IPFS storage requested but IPFS_API_URL is not configured');
        }
        const headers = {
            'Content-Type': mimeType || 'application/octet-stream'
        };
        if (env_1.ipfs.apiToken) {
            headers.Authorization = `Bearer ${env_1.ipfs.apiToken}`;
        }
        const response = await fetch(`${env_1.ipfs.apiUrl.replace(/\/$/, '')}/api/v0/add`, {
            method: 'POST',
            headers,
            body: buffer
        });
        if (!response.ok) {
            throw new ApiError_1.default(502, 'IPFS upload failed');
        }
        const result = await response.json();
        return {
            provider: 'ipfs',
            secureUrl: `${env_1.ipfs.apiUrl.replace(/\/$/, '')}/ipfs/${result.Hash}`,
            publicId: result.Hash,
            bytes: buffer.length,
            mimeType
        };
    }
    if (!env_1.cloudinary.cloudName || !env_1.cloudinary.apiKey || !env_1.cloudinary.apiSecret) {
        throw new ApiError_1.default(500, 'Cloudinary is not configured');
    }
    const uploaded = await uploadBufferToCloudinary({
        buffer,
        filename,
        folder,
        resourceType: 'auto'
    });
    return {
        provider: 'cloudinary',
        secureUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        bytes: uploaded.bytes,
        mimeType: uploaded.resource_type,
        format: uploaded.format,
        etag: uploaded.etag
    };
}
async function deleteStoredFile(publicId, provider = 'cloudinary') {
    if (!publicId) {
        return null;
    }
    if (provider === 'cloudinary') {
        return cloudinary_1.v2.uploader.destroy(publicId, { invalidate: true, resource_type: 'auto' });
    }
    return null;
}
async function downloadBufferFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new ApiError_1.default(502, `Unable to download file from storage: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

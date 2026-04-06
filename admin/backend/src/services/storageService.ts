import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinary as cloudinaryConfig, storageProvider, useIpfs, ipfs } from '../config/env';
import ApiError from '../utils/ApiError';

if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true
  });
}

function bufferToStream(buffer) {
  return Readable.from(buffer);
}

function uploadBufferToCloudinary({ buffer, filename, folder, resourceType = 'auto' }) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || cloudinaryConfig.folder,
        resource_type: resourceType,
        public_id: filename,
        overwrite: false,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}

async function uploadEncryptedBuffer({ buffer, filename, mimeType, folder }) {
  if (storageProvider === 'ipfs' || useIpfs) {
    if (!ipfs.apiUrl) {
      throw new ApiError(500, 'IPFS storage requested but IPFS_API_URL is not configured');
    }

    const headers = {
      'Content-Type': mimeType || 'application/octet-stream'
    };

    if (ipfs.apiToken) {
      headers.Authorization = `Bearer ${ipfs.apiToken}`;
    }

    const response = await fetch(`${ipfs.apiUrl.replace(/\/$/, '')}/api/v0/add`, {
      method: 'POST',
      headers,
      body: buffer
    });

    if (!response.ok) {
      throw new ApiError(502, 'IPFS upload failed');
    }

    const result = await response.json();
    return {
      provider: 'ipfs',
      secureUrl: `${ipfs.apiUrl.replace(/\/$/, '')}/ipfs/${result.Hash}`,
      publicId: result.Hash,
      bytes: buffer.length,
      mimeType
    };
  }

  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    throw new ApiError(500, 'Cloudinary is not configured');
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
    return cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: 'auto' });
  }

  return null;
}

async function downloadBufferFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(502, `Unable to download file from storage: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export {
  uploadEncryptedBuffer,
  deleteStoredFile,
  downloadBufferFromUrl
};


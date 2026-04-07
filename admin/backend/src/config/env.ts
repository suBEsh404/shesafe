import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGODB_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  ENCRYPT_FILES_BEFORE_UPLOAD: Joi.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(false),
  FILE_ENCRYPTION_KEY: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: Joi.string().allow('').default(''),
  CLOUDINARY_FOLDER: Joi.string().default('women-safety-evidence'),
  STORAGE_PROVIDER: Joi.string().valid('cloudinary', 'ipfs').default('cloudinary'),
  USE_IPFS: Joi.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(false),
  IPFS_API_URL: Joi.string().allow('').default(''),
  IPFS_API_TOKEN: Joi.string().allow('').default(''),
  BLOCKCHAIN_RPC_URL: Joi.string().allow('').default(''),
  BLOCKCHAIN_CHAIN_ID: Joi.number().integer().default(11155111),
  BLOCKCHAIN_CONTRACT_ADDRESS: Joi.string().allow('').default(''),
  BLOCKCHAIN_PRIVATE_KEY: Joi.string().allow('').default(''),
  REDIS_URL: Joi.string().allow('').default(''),
  MAX_FILE_SIZE_MB: Joi.number().integer().min(1).max(1024).default(100),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(600000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(200),
  EMERGENCY_BATCH_SECONDS: Joi.number().integer().min(1).default(60),
  TRAVEL_BATCH_SECONDS: Joi.number().integer().min(1).default(30),
  APP_BASE_URL: Joi.string().allow('').default('http://localhost:5000'),
  EXPO_PUSH_ENABLED: Joi.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(true),
  EXPO_PUSH_API_URL: Joi.string().uri().default('https://exp.host/--/api/v2/push/send')
}).unknown(true);

const { value: env, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

function parseFileEncryptionKey(rawKey) {
  const trimmedKey = String(rawKey).trim();

  if (/^[0-9a-fA-F]{64}$/.test(trimmedKey)) {
    return Buffer.from(trimmedKey, 'hex');
  }

  const base64Buffer = Buffer.from(trimmedKey, 'base64');
  if (base64Buffer.length === 32) {
    return base64Buffer;
  }

  const utf8Buffer = Buffer.from(trimmedKey, 'utf8');
  if (utf8Buffer.length === 32) {
    return utf8Buffer;
  }

  throw new Error('FILE_ENCRYPTION_KEY must resolve to exactly 32 bytes for AES-256');
}

const port = Number(env.PORT);
const isProduction = env.NODE_ENV === 'production';
const isDevelopment = env.NODE_ENV === 'development';
const mongoUri = env.MONGODB_URI;
const accessTokenSecret = env.JWT_ACCESS_SECRET;
const refreshTokenSecret = env.JWT_REFRESH_SECRET;
const accessTokenExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
const refreshTokenExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
const encryptFilesBeforeUpload = env.ENCRYPT_FILES_BEFORE_UPLOAD;
const encryptionKey = parseFileEncryptionKey(env.FILE_ENCRYPTION_KEY);
const cloudinary = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
  folder: env.CLOUDINARY_FOLDER
};
const storageProvider = env.STORAGE_PROVIDER;
const useIpfs = env.USE_IPFS;
const ipfs = {
  apiUrl: env.IPFS_API_URL,
  apiToken: env.IPFS_API_TOKEN
};
const blockchain = {
  rpcUrl: env.BLOCKCHAIN_RPC_URL,
  chainId: Number(env.BLOCKCHAIN_CHAIN_ID),
  contractAddress: env.BLOCKCHAIN_CONTRACT_ADDRESS,
  privateKey: env.BLOCKCHAIN_PRIVATE_KEY
};
const redisUrl = env.REDIS_URL;
const maxFileSizeBytes = Number(env.MAX_FILE_SIZE_MB) * 1024 * 1024;
const rateLimitWindowMs = Number(env.RATE_LIMIT_WINDOW_MS);
const rateLimitMax = Number(env.RATE_LIMIT_MAX);
const emergencyBatchSeconds = Number(env.EMERGENCY_BATCH_SECONDS);
const travelBatchSeconds = Number(env.TRAVEL_BATCH_SECONDS);
const appBaseUrl = env.APP_BASE_URL;
const expoPushEnabled = env.EXPO_PUSH_ENABLED;
const expoPushApiUrl = env.EXPO_PUSH_API_URL;

export {
  env,
  port,
  isProduction,
  isDevelopment,
  mongoUri,
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  encryptFilesBeforeUpload,
  encryptionKey,
  cloudinary,
  storageProvider,
  useIpfs,
  ipfs,
  blockchain,
  redisUrl,
  maxFileSizeBytes,
  rateLimitWindowMs,
  rateLimitMax,
  emergencyBatchSeconds,
  travelBatchSeconds,
  appBaseUrl,
  expoPushEnabled,
  expoPushApiUrl
};


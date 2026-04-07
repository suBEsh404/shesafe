"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expoPushApiUrl = exports.expoPushEnabled = exports.appBaseUrl = exports.travelBatchSeconds = exports.emergencyBatchSeconds = exports.rateLimitMax = exports.rateLimitWindowMs = exports.maxFileSizeBytes = exports.redisUrl = exports.blockchain = exports.ipfs = exports.useIpfs = exports.storageProvider = exports.cloudinary = exports.encryptionKey = exports.encryptFilesBeforeUpload = exports.refreshTokenExpiresIn = exports.accessTokenExpiresIn = exports.refreshTokenSecret = exports.accessTokenSecret = exports.mongoUri = exports.isDevelopment = exports.isProduction = exports.port = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const schema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'test', 'production').default('development'),
    PORT: joi_1.default.number().port().default(5000),
    MONGODB_URI: joi_1.default.string().required(),
    JWT_ACCESS_SECRET: joi_1.default.string().min(32).required(),
    JWT_REFRESH_SECRET: joi_1.default.string().min(32).required(),
    JWT_ACCESS_EXPIRES_IN: joi_1.default.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: joi_1.default.string().default('7d'),
    ENCRYPT_FILES_BEFORE_UPLOAD: joi_1.default.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(false),
    FILE_ENCRYPTION_KEY: joi_1.default.string().required(),
    CLOUDINARY_CLOUD_NAME: joi_1.default.string().allow('').default(''),
    CLOUDINARY_API_KEY: joi_1.default.string().allow('').default(''),
    CLOUDINARY_API_SECRET: joi_1.default.string().allow('').default(''),
    CLOUDINARY_FOLDER: joi_1.default.string().default('women-safety-evidence'),
    STORAGE_PROVIDER: joi_1.default.string().valid('cloudinary', 'ipfs').default('cloudinary'),
    USE_IPFS: joi_1.default.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(false),
    IPFS_API_URL: joi_1.default.string().allow('').default(''),
    IPFS_API_TOKEN: joi_1.default.string().allow('').default(''),
    BLOCKCHAIN_RPC_URL: joi_1.default.string().allow('').default(''),
    BLOCKCHAIN_CHAIN_ID: joi_1.default.number().integer().default(11155111),
    BLOCKCHAIN_CONTRACT_ADDRESS: joi_1.default.string().allow('').default(''),
    BLOCKCHAIN_PRIVATE_KEY: joi_1.default.string().allow('').default(''),
    REDIS_URL: joi_1.default.string().allow('').default(''),
    MAX_FILE_SIZE_MB: joi_1.default.number().integer().min(1).max(1024).default(100),
    RATE_LIMIT_WINDOW_MS: joi_1.default.number().integer().min(1000).default(600000),
    RATE_LIMIT_MAX: joi_1.default.number().integer().min(1).default(200),
    EMERGENCY_BATCH_SECONDS: joi_1.default.number().integer().min(1).default(60),
    TRAVEL_BATCH_SECONDS: joi_1.default.number().integer().min(1).default(30),
    APP_BASE_URL: joi_1.default.string().allow('').default('http://localhost:5000'),
    EXPO_PUSH_ENABLED: joi_1.default.boolean().truthy('true').truthy('1').falsy('false').falsy('0').default(true),
    EXPO_PUSH_API_URL: joi_1.default.string().uri().default('https://exp.host/--/api/v2/push/send')
}).unknown(true);
const { value: env, error } = schema.validate(process.env, { abortEarly: false });
exports.env = env;
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
exports.port = port;
const isProduction = env.NODE_ENV === 'production';
exports.isProduction = isProduction;
const isDevelopment = env.NODE_ENV === 'development';
exports.isDevelopment = isDevelopment;
const mongoUri = env.MONGODB_URI;
exports.mongoUri = mongoUri;
const accessTokenSecret = env.JWT_ACCESS_SECRET;
exports.accessTokenSecret = accessTokenSecret;
const refreshTokenSecret = env.JWT_REFRESH_SECRET;
exports.refreshTokenSecret = refreshTokenSecret;
const accessTokenExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
exports.accessTokenExpiresIn = accessTokenExpiresIn;
const refreshTokenExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
exports.refreshTokenExpiresIn = refreshTokenExpiresIn;
const encryptFilesBeforeUpload = env.ENCRYPT_FILES_BEFORE_UPLOAD;
exports.encryptFilesBeforeUpload = encryptFilesBeforeUpload;
const encryptionKey = parseFileEncryptionKey(env.FILE_ENCRYPTION_KEY);
exports.encryptionKey = encryptionKey;
const cloudinary = {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    folder: env.CLOUDINARY_FOLDER
};
exports.cloudinary = cloudinary;
const storageProvider = env.STORAGE_PROVIDER;
exports.storageProvider = storageProvider;
const useIpfs = env.USE_IPFS;
exports.useIpfs = useIpfs;
const ipfs = {
    apiUrl: env.IPFS_API_URL,
    apiToken: env.IPFS_API_TOKEN
};
exports.ipfs = ipfs;
const blockchain = {
    rpcUrl: env.BLOCKCHAIN_RPC_URL,
    chainId: Number(env.BLOCKCHAIN_CHAIN_ID),
    contractAddress: env.BLOCKCHAIN_CONTRACT_ADDRESS,
    privateKey: env.BLOCKCHAIN_PRIVATE_KEY
};
exports.blockchain = blockchain;
const redisUrl = env.REDIS_URL;
exports.redisUrl = redisUrl;
const maxFileSizeBytes = Number(env.MAX_FILE_SIZE_MB) * 1024 * 1024;
exports.maxFileSizeBytes = maxFileSizeBytes;
const rateLimitWindowMs = Number(env.RATE_LIMIT_WINDOW_MS);
exports.rateLimitWindowMs = rateLimitWindowMs;
const rateLimitMax = Number(env.RATE_LIMIT_MAX);
exports.rateLimitMax = rateLimitMax;
const emergencyBatchSeconds = Number(env.EMERGENCY_BATCH_SECONDS);
exports.emergencyBatchSeconds = emergencyBatchSeconds;
const travelBatchSeconds = Number(env.TRAVEL_BATCH_SECONDS);
exports.travelBatchSeconds = travelBatchSeconds;
const appBaseUrl = env.APP_BASE_URL;
exports.appBaseUrl = appBaseUrl;
const expoPushEnabled = env.EXPO_PUSH_ENABLED;
exports.expoPushEnabled = expoPushEnabled;
const expoPushApiUrl = env.EXPO_PUSH_API_URL;
exports.expoPushApiUrl = expoPushApiUrl;

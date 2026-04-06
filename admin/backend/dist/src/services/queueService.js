"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initQueueService = initQueueService;
exports.enqueueBlockchainWrite = enqueueBlockchainWrite;
exports.enqueueFileProcessing = enqueueFileProcessing;
const bull_1 = __importDefault(require("bull"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
let blockchainQueue = null;
let fileQueue = null;
let blockchainProcessor = null;
let fileProcessor = null;
function createQueue(name) {
    return new bull_1.default(name, env_1.redisUrl || undefined, {
        settings: {
            stalledInterval: 30 * 1000,
            maxStalledCount: 1,
            lockDuration: 30 * 1000
        }
    });
}
function initQueueService({ processBlockchainJob, processFileJob } = {}) {
    blockchainProcessor = processBlockchainJob || null;
    fileProcessor = processFileJob || null;
    if (!env_1.redisUrl) {
        logger_1.default.warn('REDIS_URL not configured, queue jobs will run inline');
        return {
            hasQueues: false
        };
    }
    blockchainQueue = createQueue('blockchain-writes');
    fileQueue = createQueue('file-processing');
    blockchainQueue.process(async (job) => {
        if (!blockchainProcessor) {
            throw new Error('Blockchain processor is not configured');
        }
        return blockchainProcessor(job.data);
    });
    fileQueue.process(async (job) => {
        if (!fileProcessor) {
            throw new Error('File processor is not configured');
        }
        return fileProcessor(job.data);
    });
    blockchainQueue.on('failed', (job, error) => {
        logger_1.default.error({ message: 'Blockchain queue job failed', jobId: job.id, error: error.message });
    });
    fileQueue.on('failed', (job, error) => {
        logger_1.default.error({ message: 'File queue job failed', jobId: job.id, error: error.message });
    });
    return {
        hasQueues: true
    };
}
async function enqueueBlockchainWrite(payload) {
    if (blockchainQueue) {
        return blockchainQueue.add('store-evidence', payload, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        });
    }
    if (!blockchainProcessor) {
        throw new Error('Blockchain processor is not configured');
    }
    return blockchainProcessor(payload);
}
async function enqueueFileProcessing(payload) {
    if (fileQueue) {
        return fileQueue.add('process-files', payload, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 3000
            },
            removeOnComplete: true,
            removeOnFail: false
        });
    }
    if (!fileProcessor) {
        throw new Error('File processor is not configured');
    }
    return fileProcessor(payload);
}

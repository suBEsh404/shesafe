"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./config/logger"));
const env_1 = require("./config/env");
const queueService_1 = require("./services/queueService");
const evidenceService_1 = __importDefault(require("./services/evidenceService"));
async function bootstrap() {
    await (0, db_1.default)();
    (0, queueService_1.initQueueService)({
        processBlockchainJob: evidenceService_1.default.retryBlockchainWrite,
        processFileJob: evidenceService_1.default.ingestBatchSession
    });
    const app = (0, app_1.default)();
    const server = app.listen(env_1.port, () => {
        logger_1.default.info(`Server started on port ${env_1.port}`);
    });
    const shutdown = async (signal) => {
        logger_1.default.info(`Shutting down server (${signal})`);
        server.close(() => {
            logger_1.default.info('HTTP server closed');
            process.exit(0);
        });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
bootstrap().catch((error) => {
    logger_1.default.error(`Failed to bootstrap server: ${error?.message || 'Unknown error'}`);
    process.exit(1);
});

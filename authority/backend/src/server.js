const createApp = require('./app');
const connectDatabase = require('./config/db');
const logger = require('./config/logger');
const { port, isProduction } = require('./config/env');
const { initQueueService } = require('./services/queueService');
const evidenceService = require('./services/evidenceService');

async function bootstrap() {
  await connectDatabase();

  initQueueService({
    processBlockchainJob: evidenceService.retryBlockchainWrite,
    processFileJob: evidenceService.ingestBatchSession
  });

  const app = createApp();
  const server = app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });

  const shutdown = async (signal) => {
    logger.info({ signal }, 'Shutting down server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  logger.error({ message: error.message, stack: error.stack }, 'Failed to bootstrap server');
  process.exit(1);
});

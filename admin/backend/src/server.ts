import createApp from './app';
import connectDatabase from './config/db';
import logger from './config/logger';
import { port } from './config/env';
import { initQueueService } from './services/queueService';
import evidenceService from './services/evidenceService';

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
    logger.info(`Shutting down server (${signal})`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  logger.error(`Failed to bootstrap server: ${error?.message || 'Unknown error'}`);
  process.exit(1);
});


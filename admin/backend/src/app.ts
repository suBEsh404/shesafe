import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes';
import logger, { morganStream } from './config/logger';
import { generalLimiter } from './middleware/rateLimiters';
import { notFound, errorHandler } from './middleware/errorMiddleware';

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(morgan('combined', { stream: morganStream }));
  app.use(generalLimiter);

  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Women Safety Evidence Locker API is healthy',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;


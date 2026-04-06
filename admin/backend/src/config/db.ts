import mongoose from 'mongoose';
import { mongoUri } from './env';
import logger from './logger';

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000
  });

  logger.info('MongoDB connected');
}

export default connectDatabase;


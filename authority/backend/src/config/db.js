const mongoose = require('mongoose');
const { mongoUri } = require('./env');
const logger = require('./logger');

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000
  });

  logger.info('MongoDB connected');
}

module.exports = connectDatabase;

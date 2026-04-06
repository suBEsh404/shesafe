import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [new transports.Console()]
});

const morganStream = {
  write(message: string) {
    logger.info(message.trim());
  }
};

export default logger;
export {
  morganStream
};


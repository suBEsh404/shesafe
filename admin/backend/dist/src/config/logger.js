"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = void 0;
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
    transports: [new winston_1.transports.Console()]
});
const morganStream = {
    write(message) {
        logger.info(message.trim());
    }
};
exports.morganStream = morganStream;
exports.default = logger;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../config/logger"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
function notFound(req, res, next) {
    next(new ApiError_1.default(404, `Route not found: ${req.originalUrl}`));
}
function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    if (!(error instanceof ApiError_1.default)) {
        logger_1.default.error({
            message: error.message,
            stack: error.stack,
            path: req.originalUrl,
            method: req.method
        });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            details: Object.values(error.errors).map((item) => item.message)
        });
    }
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate record',
            details: error.keyValue
        });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
    if (error.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal server error',
        details: isProduction ? undefined : error.details || error.stack
    });
}

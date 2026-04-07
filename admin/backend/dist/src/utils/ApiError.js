"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    statusCode;
    details;
    isOperational;
    constructor(statusCode, message, details = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ApiError;

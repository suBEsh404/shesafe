"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./config/logger");
const rateLimiters_1 = require("./middleware/rateLimiters");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
    app.use(rateLimiters_1.generalLimiter);
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Women Safety Evidence Locker API is healthy',
            timestamp: new Date().toISOString()
        });
    });
    app.use('/api', routes_1.default);
    app.use(errorMiddleware_1.notFound);
    app.use(errorMiddleware_1.errorHandler);
    return app;
}
exports.default = createApp;

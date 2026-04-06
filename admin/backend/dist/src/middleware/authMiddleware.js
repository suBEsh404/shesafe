"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequired = authenticateRequired;
exports.authenticateOptional = authenticateOptional;
exports.authorizeRoles = authorizeRoles;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokenService_1 = require("../services/tokenService");
const User_1 = __importDefault(require("../models/User"));
async function attachUser(req, token) {
    const decoded = (0, tokenService_1.verifyAccessToken)(token);
    const user = await User_1.default.findById(decoded.sub).select('-password');
    if (!user) {
        throw new ApiError_1.default(401, 'User not found');
    }
    req.user = user;
    req.token = decoded;
}
async function authenticateRequired(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.default(401, 'Authentication required');
        }
        const token = authHeader.slice(7);
        await attachUser(req, token);
        next();
    }
    catch (error) {
        next(error);
    }
}
async function authenticateOptional(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            req.token = null;
            return next();
        }
        const token = authHeader.slice(7);
        await attachUser(req, token);
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            req.user = null;
            req.token = null;
            return next();
        }
        next(error);
    }
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.default(401, 'Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError_1.default(403, 'Insufficient permissions'));
        }
        return next();
    };
}

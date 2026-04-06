"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const authService_1 = __importDefault(require("../services/authService"));
const register = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await authService_1.default.registerUser(req.body);
    res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
    });
});
exports.register = register;
const login = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await authService_1.default.loginUser(req.body);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
    });
});
exports.login = login;
const refresh = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await authService_1.default.refreshTokens(req.body.refreshToken);
    res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: result
    });
});
exports.refresh = refresh;
const logout = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await authService_1.default.logoutUser(req.body.refreshToken);
    res.status(200).json({
        success: true,
        message: 'Logout successful',
        data: result
    });
});
exports.logout = logout;
exports.default = {
    register,
    login,
    refresh,
    logout
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePushToken = exports.registerPushToken = exports.liveLocation = exports.emergency = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const alertsService_1 = __importDefault(require("../services/alertsService"));
const emergency = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await alertsService_1.default.triggerEmergencyAlert({
        ownerUser: req.user,
        input: req.body
    });
    res.status(201).json({
        success: true,
        message: 'Emergency alert dispatched',
        data: result
    });
});
exports.emergency = emergency;
const liveLocation = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await alertsService_1.default.sendLiveLocationAlert({
        ownerUser: req.user,
        input: req.body
    });
    res.status(201).json({
        success: true,
        message: 'Live location alert dispatched',
        data: result
    });
});
exports.liveLocation = liveLocation;
const registerPushToken = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await alertsService_1.default.registerPushToken({
        user: req.user,
        input: req.body
    });
    res.status(200).json({
        success: true,
        message: 'Push token registered',
        data: result
    });
});
exports.registerPushToken = registerPushToken;
const removePushToken = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await alertsService_1.default.removePushToken({
        user: req.user,
        input: req.body
    });
    res.status(200).json({
        success: true,
        message: 'Push token removed',
        data: result
    });
});
exports.removePushToken = removePushToken;
exports.default = {
    emergency,
    liveLocation,
    registerPushToken,
    removePushToken
};

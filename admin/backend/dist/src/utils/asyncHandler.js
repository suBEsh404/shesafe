"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (handler) => {
    return function wrappedHandler(req, res, next) {
        return Promise.resolve(handler(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;

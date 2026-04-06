"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSchema = exports.grantSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const grantSchema = joi_1.default.object({
    evidenceId: joi_1.default.string().required(),
    grantedTo: joi_1.default.string().required(),
    permissions: joi_1.default.array().items(joi_1.default.string().valid('view', 'download', 'share')).min(1).default(['view'])
});
exports.grantSchema = grantSchema;
const revokeSchema = joi_1.default.object({
    evidenceId: joi_1.default.string().required(),
    grantedTo: joi_1.default.string().required()
});
exports.revokeSchema = revokeSchema;

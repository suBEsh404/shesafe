"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const listQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(25),
    caseId: joi_1.default.string().optional(),
    type: joi_1.default.string().valid('emergency', 'report', 'travel').optional(),
    from: joi_1.default.date().iso().optional(),
    to: joi_1.default.date().iso().optional()
});
exports.listQuerySchema = listQuerySchema;

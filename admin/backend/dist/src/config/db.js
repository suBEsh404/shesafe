"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
async function connectDatabase() {
    mongoose_1.default.set('strictQuery', true);
    await mongoose_1.default.connect(env_1.mongoUri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000
    });
    logger_1.default.info('MongoDB connected');
}
exports.default = connectDatabase;

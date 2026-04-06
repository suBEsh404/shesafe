"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../src/config/db"));
const User_1 = __importDefault(require("../src/models/User"));
async function createAdmin() {
    await (0, db_1.default)();
    const email = 'admin@example.com';
    const existingAdmin = await User_1.default.findOne({ email });
    if (existingAdmin) {
        existingAdmin.name = 'admin';
        existingAdmin.role = 'admin';
        existingAdmin.password = 'pass123';
        await existingAdmin.save();
        console.log(`Updated admin user: ${email}`);
        return;
    }
    await User_1.default.create({
        name: 'admin',
        email,
        password: 'pass123',
        role: 'admin'
    });
    console.log(`Created admin user: ${email}`);
}
createAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
});

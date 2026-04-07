"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.list = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const contactsService_1 = __importDefault(require("../services/contactsService"));
const list = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await contactsService_1.default.listContacts({
        ownerUserId: req.user._id,
        search: req.query.search
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
exports.list = list;
const create = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await contactsService_1.default.createContact({
        ownerUserId: req.user._id,
        input: req.body
    });
    res.status(201).json({
        success: true,
        message: 'Trusted contact added',
        data: result
    });
});
exports.create = create;
const update = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await contactsService_1.default.updateContact({
        ownerUserId: req.user._id,
        contactId: req.params.contactId,
        input: req.body
    });
    res.status(200).json({
        success: true,
        message: 'Trusted contact updated',
        data: result
    });
});
exports.update = update;
const remove = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await contactsService_1.default.deleteContact({
        ownerUserId: req.user._id,
        contactId: req.params.contactId
    });
    res.status(200).json({
        success: true,
        message: 'Trusted contact removed',
        data: result
    });
});
exports.remove = remove;
exports.default = {
    list,
    create,
    update,
    remove
};

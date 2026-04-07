"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContacts = listContacts;
exports.createContact = createContact;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const TrustedContact_1 = __importDefault(require("../models/TrustedContact"));
function toContactResponse(contact) {
    return {
        id: contact._id,
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone || null,
        email: contact.email || null,
        isSharing: Boolean(contact.isSharing),
        emergencyPriority: contact.emergencyPriority || 1,
        notes: contact.notes || null,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
    };
}
async function listContacts({ ownerUserId, search = '' }) {
    const query = {
        ownerUserId
    };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { relationship: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    const contacts = await TrustedContact_1.default.find(query)
        .sort({ emergencyPriority: 1, createdAt: -1 })
        .lean();
    return contacts.map((contact) => toContactResponse(contact));
}
async function createContact({ ownerUserId, input }) {
    const contact = await TrustedContact_1.default.create({
        ownerUserId,
        name: input.name,
        relationship: input.relationship || 'Trusted Contact',
        phone: input.phone || null,
        email: input.email ? String(input.email).toLowerCase() : null,
        isSharing: input.isSharing,
        emergencyPriority: input.emergencyPriority || 1,
        notes: input.notes || null
    });
    return toContactResponse(contact);
}
async function updateContact({ ownerUserId, contactId, input }) {
    const contact = await TrustedContact_1.default.findOneAndUpdate({ _id: contactId, ownerUserId }, {
        $set: {
            ...(typeof input.name !== 'undefined' ? { name: input.name } : {}),
            ...(typeof input.relationship !== 'undefined' ? { relationship: input.relationship } : {}),
            ...(typeof input.phone !== 'undefined' ? { phone: input.phone || null } : {}),
            ...(typeof input.email !== 'undefined' ? { email: input.email ? String(input.email).toLowerCase() : null } : {}),
            ...(typeof input.isSharing !== 'undefined' ? { isSharing: Boolean(input.isSharing) } : {}),
            ...(typeof input.emergencyPriority !== 'undefined' ? { emergencyPriority: input.emergencyPriority } : {}),
            ...(typeof input.notes !== 'undefined' ? { notes: input.notes || null } : {})
        }
    }, { new: true });
    if (!contact) {
        throw new ApiError_1.default(404, 'Trusted contact not found');
    }
    return toContactResponse(contact);
}
async function deleteContact({ ownerUserId, contactId }) {
    const deleted = await TrustedContact_1.default.findOneAndDelete({ _id: contactId, ownerUserId });
    if (!deleted) {
        throw new ApiError_1.default(404, 'Trusted contact not found');
    }
    return {
        deleted: true,
        contactId
    };
}
exports.default = {
    listContacts,
    createContact,
    updateContact,
    deleteContact
};

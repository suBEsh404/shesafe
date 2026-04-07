import ApiError from '../utils/ApiError';
import TrustedContact from '../models/TrustedContact';

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
  const query: any = {
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

  const contacts = await TrustedContact.find(query)
    .sort({ emergencyPriority: 1, createdAt: -1 })
    .lean();

  return contacts.map((contact) => toContactResponse(contact));
}

async function createContact({ ownerUserId, input }) {
  const contact = await TrustedContact.create({
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
  const contact = await TrustedContact.findOneAndUpdate(
    { _id: contactId, ownerUserId },
    {
      $set: {
        ...(typeof input.name !== 'undefined' ? { name: input.name } : {}),
        ...(typeof input.relationship !== 'undefined' ? { relationship: input.relationship } : {}),
        ...(typeof input.phone !== 'undefined' ? { phone: input.phone || null } : {}),
        ...(typeof input.email !== 'undefined' ? { email: input.email ? String(input.email).toLowerCase() : null } : {}),
        ...(typeof input.isSharing !== 'undefined' ? { isSharing: Boolean(input.isSharing) } : {}),
        ...(typeof input.emergencyPriority !== 'undefined' ? { emergencyPriority: input.emergencyPriority } : {}),
        ...(typeof input.notes !== 'undefined' ? { notes: input.notes || null } : {})
      }
    },
    { new: true }
  );

  if (!contact) {
    throw new ApiError(404, 'Trusted contact not found');
  }

  return toContactResponse(contact);
}

async function deleteContact({ ownerUserId, contactId }) {
  const deleted = await TrustedContact.findOneAndDelete({ _id: contactId, ownerUserId });
  if (!deleted) {
    throw new ApiError(404, 'Trusted contact not found');
  }

  return {
    deleted: true,
    contactId
  };
}

export {
  listContacts,
  createContact,
  updateContact,
  deleteContact
};

export default {
  listContacts,
  createContact,
  updateContact,
  deleteContact
};

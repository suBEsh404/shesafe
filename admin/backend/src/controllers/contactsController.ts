import asyncHandler from '../utils/asyncHandler';
import contactsService from '../services/contactsService';

const list = asyncHandler(async (req, res) => {
  const result = await contactsService.listContacts({
    ownerUserId: req.user._id,
    search: req.query.search
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const create = asyncHandler(async (req, res) => {
  const result = await contactsService.createContact({
    ownerUserId: req.user._id,
    input: req.body
  });

  res.status(201).json({
    success: true,
    message: 'Trusted contact added',
    data: result
  });
});

const update = asyncHandler(async (req, res) => {
  const result = await contactsService.updateContact({
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

const remove = asyncHandler(async (req, res) => {
  const result = await contactsService.deleteContact({
    ownerUserId: req.user._id,
    contactId: req.params.contactId
  });

  res.status(200).json({
    success: true,
    message: 'Trusted contact removed',
    data: result
  });
});

export {
  list,
  create,
  update,
  remove
};

export default {
  list,
  create,
  update,
  remove
};

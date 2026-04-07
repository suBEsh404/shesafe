import Joi from 'joi';

const contactIdParamSchema = Joi.object({
  contactId: Joi.string().length(24).hex().required()
});

const createContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  relationship: Joi.string().trim().max(120).allow('', null).default('Trusted Contact'),
  phone: Joi.string().trim().max(30).allow('', null),
  email: Joi.string().email().allow('', null),
  isSharing: Joi.boolean().default(true),
  emergencyPriority: Joi.number().integer().min(1).max(99).default(1),
  notes: Joi.string().trim().max(500).allow('', null)
}).or('phone', 'email');

const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  relationship: Joi.string().trim().max(120).allow('', null),
  phone: Joi.string().trim().max(30).allow('', null),
  email: Joi.string().email().allow('', null),
  isSharing: Joi.boolean(),
  emergencyPriority: Joi.number().integer().min(1).max(99),
  notes: Joi.string().trim().max(500).allow('', null)
}).min(1);

const contactsListQuerySchema = Joi.object({
  search: Joi.string().trim().max(120).allow('', null).default('')
});

export {
  contactIdParamSchema,
  createContactSchema,
  updateContactSchema,
  contactsListQuerySchema
};

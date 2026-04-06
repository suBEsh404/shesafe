const Joi = require('joi');

const fileUploadCommon = {
  caseId: Joi.string().min(1).max(120).required(),
  type: Joi.string().valid('emergency', 'report', 'travel').required(),
  isAnonymous: Joi.boolean().default(false),
  ownerAlias: Joi.string().min(3).max(120).allow('', null),
  walletAddress: Joi.string().allow('', null),
  metadata: Joi.object().unknown(true).default({})
};

const uploadSchema = Joi.object({
  ...fileUploadCommon,
  description: Joi.string().max(2000).allow('', null)
});

const emergencySchema = Joi.object({
  ...fileUploadCommon,
  sessionId: Joi.string().min(8).max(120).optional(),
  mode: Joi.string().valid('emergency', 'travel').default('emergency'),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    accuracy: Joi.number().optional()
  }).default({}),
  isFinal: Joi.boolean().default(false)
});

const travelSchema = Joi.object({
  caseId: Joi.string().min(1).max(120).required(),
  sessionId: Joi.string().min(8).max(120).required(),
  type: Joi.string().valid('travel').default('travel'),
  metadata: Joi.object().unknown(true).default({}),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    accuracy: Joi.number().optional()
  }).default({}),
  isFinal: Joi.boolean().default(false)
});

const idParamSchema = Joi.object({
  id: Joi.string().required()
});

const userParamSchema = Joi.object({
  userId: Joi.string().required()
});

module.exports = {
  uploadSchema,
  emergencySchema,
  travelSchema,
  idParamSchema,
  userParamSchema
};

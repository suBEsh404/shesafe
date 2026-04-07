import Joi from 'joi';

const emergencyAlertSchema = Joi.object({
  sessionId: Joi.string().trim().min(3).max(120).allow('', null),
  message: Joi.string().trim().max(500).allow('', null),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    accuracy: Joi.number().optional()
  }).default({}),
  metadata: Joi.object().unknown(true).default({})
});

const liveLocationSchema = Joi.object({
  sessionId: Joi.string().trim().min(3).max(120).required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    accuracy: Joi.number().optional()
  }).required(),
  metadata: Joi.object().unknown(true).default({})
});

const pushTokenSchema = Joi.object({
  token: Joi.string().trim().min(10).max(300).required(),
  deviceId: Joi.string().trim().max(150).allow('', null),
  platform: Joi.string().valid('ios', 'android', 'web', 'unknown').default('unknown')
});

const removePushTokenSchema = Joi.object({
  token: Joi.string().trim().min(10).max(300).required()
});

export {
  emergencyAlertSchema,
  liveLocationSchema,
  pushTokenSchema,
  removePushTokenSchema
};

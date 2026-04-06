const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(128).required(),
  role: Joi.string().valid('user', 'authority', 'admin').default('user'),
  walletAddress: Joi.string().trim().optional(),
  isAnonymous: Joi.boolean().default(false)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema
};

import Joi from 'joi';

const adminUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid('active', 'pending', 'suspended').optional(),
  role: Joi.string().valid('user', 'authority', 'admin').optional(),
  search: Joi.string().trim().max(120).optional()
});

const inviteUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(128).required(),
  confirmPassword: Joi.string().min(10).max(128).valid(Joi.ref('password')).required(),
  role: Joi.string().valid('user', 'authority', 'admin').default('authority')
});

const updateUserStatusParamsSchema = Joi.object({
  userId: Joi.string().length(24).hex().required()
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'suspended').required()
});

const exportUsersQuerySchema = Joi.object({
  format: Joi.string().valid('json', 'csv').default('csv'),
  status: Joi.string().valid('active', 'pending', 'suspended').optional(),
  role: Joi.string().valid('user', 'authority', 'admin').optional(),
  search: Joi.string().trim().max(120).optional()
});

const reviewControlsSchema = Joi.object({
  notes: Joi.string().trim().max(1000).allow('').optional()
});

const generateReportSchema = Joi.object({
  format: Joi.string().valid('json', 'csv').default('json'),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional()
});

export {
  adminUsersQuerySchema,
  inviteUserSchema,
  updateUserStatusParamsSchema,
  updateUserStatusSchema,
  exportUsersQuerySchema,
  reviewControlsSchema,
  generateReportSchema
};
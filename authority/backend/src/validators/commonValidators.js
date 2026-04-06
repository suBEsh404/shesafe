const Joi = require('joi');

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  caseId: Joi.string().optional(),
  type: Joi.string().valid('emergency', 'report', 'travel').optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional()
});

module.exports = {
  listQuerySchema
};

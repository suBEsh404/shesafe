import Joi from 'joi';

const grantSchema = Joi.object({
  evidenceId: Joi.string().required(),
  grantedTo: Joi.string().required(),
  permissions: Joi.array().items(Joi.string().valid('view', 'download', 'share')).min(1).default(['view'])
});

const revokeSchema = Joi.object({
  evidenceId: Joi.string().required(),
  grantedTo: Joi.string().required()
});

export {
  grantSchema,
  revokeSchema
};


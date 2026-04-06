import ApiError from '../utils/ApiError';

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new ApiError(400, message, error.details));
    }

    req[source] = value;
    return next();
  };
}

export default validate;


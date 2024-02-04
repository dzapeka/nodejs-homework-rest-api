const Joi = require('joi');

const usersVerifyEmailSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

module.exports = usersVerifyEmailSchema;

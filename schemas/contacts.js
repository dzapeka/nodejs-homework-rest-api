const Joi = require('joi');

const contactsSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().min(3).trim().required(),
});

module.exports = contactsSchema;

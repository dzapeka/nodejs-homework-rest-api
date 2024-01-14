const Joi = require('joi');

const contactCreateSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().min(3).trim().required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().min(3).trim(),
}).or('name', 'email', 'phone');

module.exports = { contactCreateSchema, contactUpdateSchema };

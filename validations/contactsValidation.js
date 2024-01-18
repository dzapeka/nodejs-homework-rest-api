const Joi = require('joi');

// Extracting common parts to separate schema
const contactBaseSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().min(3).trim(),
  favorite: Joi.boolean(),
});

const contactCreateSchema = contactBaseSchema.keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const contactUpdateSchema = contactBaseSchema.or('name', 'email', 'phone');

const contactFavoriteStatusSchema = contactBaseSchema.keys({
  favorite: Joi.boolean().required(),
});

module.exports = {
  contactCreateSchema,
  contactUpdateSchema,
  contactFavoriteStatusSchema,
};

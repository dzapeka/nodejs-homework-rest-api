const {
  contactCreateSchema,
  contactUpdateSchema,
  contactFavoriteStatusSchema,
} = require('../validations/contactsValidation');

const validateContact = schema => {
  return (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).send(error.details.map(err => err.message).join(', '));
    } else {
      next();
    }
  };
};

module.exports = {
  validateContactCreate: validateContact(contactCreateSchema),
  validateContactUpdate: validateContact(contactUpdateSchema),
  validateContactFavoriteStatus: validateContact(contactFavoriteStatusSchema),
};

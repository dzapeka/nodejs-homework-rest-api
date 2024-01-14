const Contact = require('../models/contact');
const {
  contactCreateSchema,
  contactUpdateSchema,
} = require('../schemas/contacts');

const validateContactSchema = (schema, body) => {
  const response = schema.validate(body, { abortEarly: false });
  return typeof response.error === 'undefined'
    ? null
    : response.error.details.map(err => err.message).join(', ');
};

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (e) {
    next(e);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact)
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: 'Not Found',
      });
    res.json(contact);
  } catch (e) {
    next(e);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  const validationError = validateContactSchema(contactCreateSchema, req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const { name, email, phone } = req.body;

  try {
    const result = await Contact.create({ name, email, phone });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const validationError = validateContactSchema(contactUpdateSchema, req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  try {
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      {
        favorite: req.body.favorite,
      },
      { new: true }
    );

    if (!result) return res.status(404).json({ message: 'Not found' });
    res.send(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

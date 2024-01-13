const express = require('express');
const router = express.Router();
const path = require('path');
const contactsSchema = require(path.join(__dirname, '../../schemas/contacts'));
const Contacts = require(path.join(__dirname, '../../contacts.js'));

const validateContactSchema = (schema, body) => {
  const response = schema.validate(body, { abortEarly: false });
  return typeof response.error === 'undefined'
    ? null
    : response.error.details.map(err => err.message).join(', ');
};

router.get('/', async (req, res, next) => {
  try {
    const allContacts = await Contacts.getAllContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contacts.getContactById(contactId);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const validationError = validateContactSchema(contactsSchema, req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const { name, email, phone } = req.body;

  try {
    const newContact = await Contacts.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await Contacts.removeContact(contactId);
    if (!deletedContact) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const validationError = validateContactSchema(contactsSchema, req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  try {
    const updatedContact = await Contacts.updateContact(contactId, req.body);
    if (!updatedContact) return res.status(404).json({ message: 'Not found' });
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

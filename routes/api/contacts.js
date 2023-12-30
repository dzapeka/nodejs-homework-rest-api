const express = require('express');
const router = express.Router();
const path = require('path');
const contactsSchema = require(path.join(__dirname, '../../schemas/contacts'));
const Contacts = require(path.join(__dirname, '../../contacts.js'));

router.get('/', async (req, res, next) => {
  res.json(await Contacts.getAllContacts());
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contacts.getContactById(contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.json(contact);
});

router.post('/', async (req, res, next) => {
  const response = contactsSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== 'undefined') {
    return res
      .status(400)
      .send(response.error.details.map(err => err.message).join(', '));
  }

  const { name, email, phone } = response.value;
  const newContact = await Contacts.addContact(name, email, phone);

  res.status(201).json(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await Contacts.removeContact(contactId);
  if (!deletedContact) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'contact deleted' });
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const response = contactsSchema.validate(req.body, { abortEarly: false });
  if (typeof response.error !== 'undefined') {
    return res
      .status(400)
      .send(response.error.details.map(err => err.message).join(', '));
  }

  const updatedContact = await Contacts.updateContact(
    contactId,
    response.value
  );

  if (!updatedContact) return res.status(404).json({ message: 'Not found' });

  res.json(updatedContact);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact');
const {
  validateContactCreateSchema,
  validateContactUpdateSchema,
} = require('../middlewares/validateContactSchema');

router.get('/', ContactController.listContacts);

router.get('/:contactId', ContactController.getContactById);

router.post('/', validateContactCreateSchema, ContactController.addContact);

router.delete('/:contactId', ContactController.removeContact);

router.put(
  '/:contactId',
  validateContactUpdateSchema,
  ContactController.updateContact
);

router.patch('/:contactId/favorite', ContactController.updateStatusContact);

module.exports = router;

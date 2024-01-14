const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact');
const {
  validateContactCreate,
  validateContactUpdate,
  validateContactFavoriteStatus,
} = require('../middlewares/validateContactSchema');

router.get('/', ContactController.listContacts);

router.get('/:contactId', ContactController.getContactById);

router.post('/', validateContactCreate, ContactController.addContact);

router.delete('/:contactId', ContactController.removeContact);

router.put(
  '/:contactId',
  validateContactUpdate,
  ContactController.updateContact
);

router.patch(
  '/:contactId/favorite',
  validateContactFavoriteStatus,
  ContactController.updateStatusContact
);

module.exports = router;

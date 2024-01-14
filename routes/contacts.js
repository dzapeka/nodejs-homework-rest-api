const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact');

router.get('/', ContactController.listContacts);

router.get('/:contactId', ContactController.getContactById);

router.post('/', ContactController.addContact);

router.delete('/:contactId', ContactController.removeContact);

router.put('/:contactId', ContactController.updateContact);

router.patch('/:contactId/favorite', ContactController.updateStatusContact);

module.exports = router;

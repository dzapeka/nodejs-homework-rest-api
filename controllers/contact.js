const ContactService = require('../service/contact.js');

async function listContacts(req, res, next) {
  try {
    const userId = req.user.id;
    const contacts = await ContactService.getAll(userId);
    res.send(contacts);
  } catch (e) {
    next(e);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user.id;

  try {
    const contact = await ContactService.getById(userId, contactId);
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
  const userId = req.user.id;

  try {
    const deletedContact = await ContactService.remove(userId, contactId);
    if (!deletedContact) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  const { name, email, phone } = req.body;
  const userId = req.user.id;

  try {
    const result = await ContactService.create({
      name,
      email,
      phone,
      owner: userId,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user.id;

  try {
    const result = await ContactService.update(userId, contactId, req.body);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user.id;

  try {
    const result = await ContactService.updateFavoriteStatus(
      userId,
      contactId,
      req.body.favorite
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

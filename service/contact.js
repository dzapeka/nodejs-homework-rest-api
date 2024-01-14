const Contact = require('../models/contact');

async function getAll() {
  return await Contact.find();
}

async function getById(contactId) {
  return await Contact.findById(contactId);
}

async function remove(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function create({ name, email, phone }) {
  return await Contact.create({ name, email, phone });
}

async function update(contactId, fields) {
  return Contact.findByIdAndUpdate(contactId, fields, {
    new: true,
  });
}

async function updateFavoriteStatus(contactId, favorite) {
  return Contact.findByIdAndUpdate(
    contactId,
    {
      favorite: favorite,
    },
    { new: true }
  );
}

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
  updateFavoriteStatus,
};

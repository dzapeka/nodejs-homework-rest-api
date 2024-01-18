const Contact = require('../models/contact');

const mongoose = require('mongoose');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getAll() {
  return await Contact.find();
}

async function getById(contactId) {
  if (!isValidId(contactId)) {
    return null;
  }
  return await Contact.findById(contactId);
}

async function remove(contactId) {
  if (!isValidId(contactId)) {
    return null;
  }
  return Contact.findByIdAndDelete(contactId);
}

async function create({ name, email, phone }) {
  return await Contact.create({ name, email, phone });
}

async function update(contactId, fields) {
  if (!isValidId(contactId)) {
    return null;
  }
  return Contact.findByIdAndUpdate(contactId, fields, {
    new: true,
  });
}

async function updateFavoriteStatus(contactId, favorite) {
  if (!isValidId(contactId)) {
    return null;
  }

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

const Contact = require('../models/contact');

const mongoose = require('mongoose');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getAll(userId) {
  return await Contact.find({ owner: userId });
}

async function getById(userId, contactId) {
  if (!isValidId(contactId)) {
    return null;
  }
  return await Contact.findOne({ _id: contactId, owner: userId });
}

async function remove(userId, contactId) {
  if (!isValidId(contactId)) {
    return null;
  }

  return Contact.findOneAndDelete({ _id: contactId, owner: userId });
}

async function create({ name, email, phone, owner }) {
  return await Contact.create({ name, email, phone, owner });
}

async function update(userId, contactId, fields) {
  if (!isValidId(contactId)) {
    return null;
  }
  return Contact.findOneAndUpdate({ _id: contactId, owner: userId }, fields, {
    new: true,
  });
}

async function updateFavoriteStatus(userId, contactId, favorite) {
  if (!isValidId(contactId)) {
    return null;
  }

  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
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

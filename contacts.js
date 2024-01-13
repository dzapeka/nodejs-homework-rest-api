const { nanoid } = require('nanoid');
const fs = require('node:fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');

async function readContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getAllContacts() {
  return await readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find(contact => contact.id === contactId) || null;
  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);

  if (index === -1) return null;

  const removedContact = contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { name, email, phone, id: nanoid() };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateContact(contactId, newContactData) {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...newContactData };
  await writeContacts(contacts);
  return contacts[index];
}

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

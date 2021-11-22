const User = require('../models/user');
const Contact = require('../models/contact');

const multipleContactsList = [
  {
    name: 'Alice A.',
    number: '222-222-2222',
  },
  {
    name: 'Bethany B.',
    number: '1234567890',
  },
  {
    name: 'Charlie C.',
    number: '123-123-1231',
  },
  {
    name: 'Dragos',
    number: '234-234-2342',
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const contactsInDb = async () => {
  const contacts = await Contact.find({});
  return contacts.map((u) => u.toJSON());
};

module.exports = {
  multipleContactsList,
  usersInDb,
  contactsInDb,
};

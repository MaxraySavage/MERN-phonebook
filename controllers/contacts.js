/* eslint-disable consistent-return */
const contactsRouter = require('express').Router();
const Contact = require('../models/contact');
const User = require('../models/user');
const { authenticateToken } = require('../utils/middleware');

contactsRouter.get('/', authenticateToken, async (request, response) => {
  const user = await User.findById(request.user.id);
  const contacts = await Contact.find({ user: user.id });
  response.json(contacts);
});

contactsRouter.get('/:id', authenticateToken, async (request, response) => {
  const user = await User.findById(request.user.id);
  const contact = await Contact.findById(request.params.id);

  if (contact.user.toString() === user.id) {
    await Contact.findById(request.params.id);
    response.json(contact);
  } else {
    return response.status(401).json({ error: 'operation not authorized' });
  }
});

contactsRouter.post('/', authenticateToken, async (request, response) => {
  const user = await User.findById(request.user.id);
  const { body } = request;

  const contact = new Contact({
    name: body.name,
    number: body.number,
    user: user.id,
  });

  const savedContact = await contact.save();
  user.contacts = user.contacts.concat(savedContact.id);
  await user.save();

  response.status(201).json(savedContact);
});

contactsRouter.delete('/:id', authenticateToken, async (request, response) => {
  const user = await User.findById(request.user.id);
  const contact = await Contact.findById(request.params.id);

  if (contact.user.toString() === user.id) {
    await Contact.findByIdAndRemove(request.params.id);
    return response.status(204).end();
  }

  return response.status(401).json({ error: 'operation not authorized' });
});

contactsRouter.put('/:id', authenticateToken, async (request, response) => {
  const user = await User.findById(request.user.id);
  const currentContact = await Contact.findById(request.params.id);

  if (currentContact.user.toString() !== user.id) {
    return response.status(401).json({ error: 'operation not authorized' });
  }

  const { body } = request;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `Missing ${!body.name ? 'name' : ''}${!body.name && !body.number ? ' and ' : ''}${!body.number ? 'number' : ''}`,
    });
  }

  const newContact = {
    name: body.name,
    number: body.number,
    user: user.id,
  };

  const updatedContact = await Contact.findByIdAndUpdate(
    request.params.id,
    newContact,
    { new: true, runValidators: true },
  );

  response.json(updatedContact);
});

module.exports = contactsRouter;

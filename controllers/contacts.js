/* eslint-disable consistent-return */
const contactsRouter = require('express').Router();
const Contact = require('../models/contact');

contactsRouter.get('/', (request, response) => {
  Contact.find({}).then((contact) => {
    response.json(contact);
  });
});

contactsRouter.get('/info', (request, response) => {
  Contact.find({}).then((contact) => {
    response.send(`Phonebook has info for ${contact.length} contacts <br/><br/> ${new Date().toString()}`);
  });
});

contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

contactsRouter.post('/', (request, response, next) => {
  const { body } = request;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save()
    .then((savedContact) => savedContact.toJSON())
    .then((savedandFormattedContact) => {
      response.json(savedandFormattedContact);
    })
    .catch((error) => next(error));
});

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

contactsRouter.put('/:id', (request, response, next) => {
  const { body } = request;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `Missing ${!body.name ? 'name' : ''}${!body.name && !body.number ? ' and ' : ''}${!body.number ? 'number' : ''}`,
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

module.exports = contactsRouter;

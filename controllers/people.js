/* eslint-disable consistent-return */
const peopleRouter = require('express').Router();
const Person = require('../models/person');

peopleRouter.get('/', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

peopleRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

peopleRouter.post('/', (request, response, next) => {
  const { body } = request;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedandFormattedPerson) => {
      response.json(savedandFormattedPerson);
    })
    .catch((error) => next(error));
});

peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

peopleRouter.put('/:id', (request, response, next) => {
  const { body } = request;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `Missing ${!body.name ? 'name' : ''}${!body.name && !body.number ? ' and ' : ''}${!body.number ? 'number' : ''}`,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

peopleRouter.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    response.send(`Phonebook has info for ${people.length} people <br/><br/> ${new Date().toString()}`);
  });
});

module.exports = peopleRouter;

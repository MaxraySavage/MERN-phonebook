const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Contact = require('../models/contact');
const User = require('../models/user');

let authHeader = 'bearer ';

beforeEach(async () => {
  await Contact.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 12);
  const user = new User({
    username: 'root',
    firstName: 'JC',
    lastName: 'Denton',
    passwordHash,
  });

  const savedUser = await user.save();

  // eslint-disable-next-line no-restricted-syntax
  for (const contact of helper.multipleContactsList) {
    contact.user = savedUser.id;
    const contactObject = new Contact(contact);
    // eslint-disable-next-line no-await-in-loop
    await contactObject.save();
  }

  const userForToken = {
    username: savedUser.username,
    id: savedUser.id,
  };

  const token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);

  authHeader = `bearer ${token}`;
});

describe('when there are some contacts in the database', () => {
  test('contacts are returned as json', async () => {
    await api.get('/api/contacts').set('Authorization', authHeader).expect(200).expect('Content-Type', /application\/json/);
  });

  test('all contacts are returned', async () => {
    const response = await api.get('/api/contacts').set('Authorization', authHeader);

    expect(response.body).toHaveLength(helper.multipleContactsList.length);
  });

  test('a specific contact is within the returned contacts', async () => {
    const response = await api.get('/api/contacts').set('Authorization', authHeader);

    expect(response.body[0].likes).toEqual(helper.multipleContactsList[0].likes);
  });

  test('contacts are returned with id property not _id', async () => {
    const response = await api.get('/api/contacts').set('Authorization', authHeader);

    expect(response.body[0].id).toBeDefined();

    // eslint-disable-next-line no-underscore-dangle
    expect(response.body[0]._id).not.toBeDefined();
  });
});

describe('addition of a new contact', () => {
  test('succeeds with valid data', async () => {
    const newContact = {
      name: 'Hartmann',
      number: '12347893',
    };

    await api
      .post('/api/contacts')
      .set('Authorization', authHeader)
      .send(newContact)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const contactsAtEnd = await helper.contactsInDb();
    expect(contactsAtEnd).toHaveLength(helper.multipleContactsList.length + 1);

    const names = contactsAtEnd.map((contact) => contact.name);
    expect(names).toContain(newContact.name);
  });

  test('fails with status code 400 if data invaild', async () => {
    const missingName = {
      number: '12347893',
    };

    const missingNumber = {
      name: 'Hartmann',
    };

    await api
      .post('/api/contacts')
      .set('Authorization', authHeader)
      .send(missingName)
      .expect(400);

    await api
      .post('/api/contacts')
      .set('Authorization', authHeader)
      .send(missingNumber)
      .expect(400);

    const contactsAtEnd = await helper.contactsInDb();
    expect(contactsAtEnd).toHaveLength(helper.multipleContactsList.length);
  });
});

describe('deletion of a contact', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const contactsAtStart = await helper.contactsInDb();
    const contactToDelete = contactsAtStart[0];

    await api
      .delete(`/api/contacts/${contactToDelete.id}`)
      .set('Authorization', authHeader)
      .expect(204);

    const contactsAtEnd = await helper.contactsInDb();

    expect(contactsAtEnd).toHaveLength(
      helper.multipleContactsList.length - 1,
    );

    const names = contactsAtEnd.map((c) => c.name);

    expect(names).not.toContain(contactToDelete.name);
  });
});

describe('updating a contact', () => {
  test('succeeds if id is valid', async () => {
    const contactsAtStart = await helper.contactsInDb();
    const contactToChange = contactsAtStart[0];
    contactToChange.number += 1;

    await api
      .put(`/api/contacts/${contactToChange.id}`)
      .set('Authorization', authHeader)
      .send(contactToChange)
      .expect(200);

    const contactsAtEnd = await helper.contactsInDb();

    const changedContact = contactsAtEnd.find((contact) => contact.id === contactToChange.id);
    expect(changedContact.number).toEqual(contactToChange.number);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

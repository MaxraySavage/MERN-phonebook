const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

// ...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret, safe', 12);
    const user = new User({
      username: 'root',
      firstName: 'JC',
      lastName: 'Denton',
      passwordHash,
    });

    await user.save();
  });

  test('test db initialization is working', async () => {
    const usersAtStart = await helper.usersInDb();
    expect(usersAtStart).toHaveLength(1);
    expect(usersAtStart.map((u) => u.username)).toContain('root');
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'lgaga',
      firstName: 'Stefani',
      lastName: 'Germanotta',
      password: 'l1ttl3m0nst3r5',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      firstName: 'The',
      lastName: 'Usurper',
      password: 'kalikali',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'r',
      firstName: 'The',
      lastName: 'Shortener',
      password: 'kalikali',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username must be at least 3 characters');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      firstName: 'The',
      lastName: 'Shortener',
      password: 'kal',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password must be at least 5 characters');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

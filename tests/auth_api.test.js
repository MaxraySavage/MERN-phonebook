const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('when there is an attempt to login', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret-safe', 12);
    const user = new User({
      username: 'root',
      firstName: 'JC',
      lastName: 'Denton',
      passwordHash,
    });

    await user.save();
  });

  test('test db initialization works', async () => {
    const usersAtStart = await helper.usersInDb();
    expect(usersAtStart).toHaveLength(1);
    expect(usersAtStart.map((u) => u.username)).toContain('root');
  });

  test('login succeeds when given correct username and password', async () => {
    const loginInfo = {
      username: 'root',
      password: 'sekret-safe',
    };

    const result = await api
      .post('/api/auth')
      .send(loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const expectedUserInfo = {
      username: 'root',
      firstName: 'JC',
    };

    expect(result.body).toHaveProperty('token');
    expect(result.body).toMatchObject(expectedUserInfo);
    const tokenContents = jwt.verify(result.body.token, process.env.ACCESS_TOKEN_SECRET);
    expect(tokenContents).toHaveProperty('id');
    expect(tokenContents).toHaveProperty('username');
  });

  test('incorrect login responds with status code 401', async () => {
    const loginInfo = {
      username: 'root',
      password: 'sekret-saf',
    };

    const result = await api
      .post('/api/auth')
      .send(loginInfo)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body).not.toHaveProperty('token');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// mongoose-unique-validator has major bugs so we are checking if username is unique manually
// eslint-disable-next-line consistent-return
usersRouter.post('/', async (request, response) => {
  const { body } = request;

  const usernameNotUnique = await User.exists({ username: body.username });

  if (usernameNotUnique) {
    return response.status(400).json({
      error: 'Sorry, that username is already taken',
    });
  }

  if (!body.password || body.password.length < 5) {
    return response.status(400).json({
      error: body.password ? 'Your password must be at least 5 characters' : 'Please supply a password',
    });
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    firstName: body.firstName,
    lastName: body.lastName,
    passwordHash,
    contacts: body.contacts || [],
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;

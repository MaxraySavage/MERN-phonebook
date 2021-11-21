const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRouter = require('express').Router();
const User = require('../models/user');

// eslint-disable-next-line consistent-return
authRouter.post('/', async (request, response) => {
  const { body } = request;
  if (!body.username || !body.password) return response.sendStatus(401);

  const user = await User.findOne({ username: body.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);

  response
    .status(200)
    .send({ token, username: user.username, firstName: user.firstName });
});

module.exports = authRouter;

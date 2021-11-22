/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
}

  logger.error(error.message);

  next(error);
};

const authenticateToken = async (request, response, next) => {
  const authHeader = request.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return response.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return response.sendStatus(403);
    request.user = await User.findById(user.id);
    next();
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateToken,
};

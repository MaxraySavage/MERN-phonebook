const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const app = express();

const peopleRouter = require('./controllers/people');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to mongoDB');
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/people', peopleRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

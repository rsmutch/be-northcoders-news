const express = require('express');
const apiRouter = require('./routes/api-router');
const app = express();
const cors = require('cors');
const {
  send404,
  handleInternalErrors,
  handleCustomErrors,
  handlePSQLErrors
} = require('./controllers/errors');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', send404);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;

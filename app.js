const express = require('express');
const apiRouter = require('./routes/api-router');
const app = express();
const { send404, handleInternalErrors, handleCustomErrors } = require('./controllers/errors.controllers')

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', send404);

app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;

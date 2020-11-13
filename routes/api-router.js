const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const articlesRouter = require('./articles-router');
const { getApi } = require('../controllers/api');
const { invalidMethodError } = require('../controllers/errors');

apiRouter.route('/', getApi).get(getApi).all(invalidMethodError);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;

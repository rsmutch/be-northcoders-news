const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topics');
const { invalidMethodError } = require('../controllers/errors');

topicsRouter
  .route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(invalidMethodError);

module.exports = topicsRouter;

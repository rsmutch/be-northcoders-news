const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics');

topicsRouter.router('/').get(getAllTopics);

module.exports = topicsRouter;

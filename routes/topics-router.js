const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics');
const { invalidMethodError } = require('../controllers/errors');

topicsRouter.route('/').get(getAllTopics).all(invalidMethodError);

module.exports = topicsRouter;

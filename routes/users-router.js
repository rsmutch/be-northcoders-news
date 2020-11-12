const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users');
const { invalidMethodError } = require('../controllers/errors');

usersRouter.route('/:username').get(getUserByUsername).all(invalidMethodError);

module.exports = usersRouter;

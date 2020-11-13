const usersRouter = require('express').Router();
const { getUsers, postUser } = require('../controllers/users');
const { invalidMethodError } = require('../controllers/errors');
usersRouter.route('/').post(postUser).get(getUsers).all(invalidMethodError);

usersRouter.route('/:username').get(getUsers).all(invalidMethodError);

module.exports = usersRouter;

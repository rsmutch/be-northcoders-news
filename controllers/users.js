const { fetchUsers, createUser } = require('../models/users');

exports.getUsers = (req, res, next) => {
  const { username } = req.params;
  const sortBy = req.query.sort_by;
  const { order } = req.query;
  fetchUsers(username, sortBy, order)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { body } = req;
  createUser(body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

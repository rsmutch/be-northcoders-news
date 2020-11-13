const connection = require('../db/connection');

exports.fetchUsers = (username, sortBy, order) => {
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  const usersColumns = ['username', 'avatar_url', 'name'];
  return connection
    .select('*')
    .from('users')
    .modify((query) => {
      if (username) {
        query.where('username', username);
      }
      if (!usersColumns.includes(sortBy)) {
        query.orderBy('username', order);
      } else {
        query.orderBy(sortBy, order);
      }
    })
    .then((userData) => {
      if (userData.length === 0) {
        return Promise.reject({ status: 404, msg: 'Username not found' });
      } else if (userData.length > 1) {
        return userData;
      }
      return userData[0];
    });
};

exports.createUser = (newUser) => {
  if (!newUser.username) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return connection
    .insert(newUser)
    .into('users')
    .returning('*')
    .then((addedUser) => {
      return addedUser[0];
    });
};

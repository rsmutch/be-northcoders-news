const connection = require('../db/connection');

exports.fetchAllTopics = () => {
  return connection.select('*').from('topics');
};

exports.createTopic = (newTopic) => {
  if (!newTopic.slug) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return connection
    .insert(newTopic)
    .into('topics')
    .returning('*')
    .then((addedTopic) => {
      return addedTopic[0];
    });
};

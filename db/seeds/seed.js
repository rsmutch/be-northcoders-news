const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');
const { dateFormatter, commentFormatter } = require('../utils/data-manipulation');

exports.seed = (connection) => {
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      return connection.insert(topicData).into('topics').returning('*');
    })
    .then((topicRows) => {
      console.log(`inserted ${topicRows.length} topics`);
    })
    .then(() => {
      return connection.insert(userData).into('users').returning('*');
    })
    .then((userRows) => {
      console.log(`inserted ${userRows.length} users`);
    })
    .then(() => {
      const formattedArticles = dateFormatter(articleData);
      return connection
        .insert(formattedArticles)
        .into('articles')
        .returning('*');
    })
    .then((articleRows) => {
      console.log(`inserted ${articleRows.length} articles`);
    })
    .then(() => {
      const formattedDate = dateFormatter(commentData);
      const formattedComments = commentFormatter(formattedDate);

    })

};

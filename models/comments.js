const connection = require('../db/connection');

exports.fetchCommentsByArticleId = (
  articleId,
  orderBy = 'created_at',
  order = 'desc'
) => {
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', articleId)
    .orderBy(orderBy, order);
};

exports.createComment = (articleId, newComment) => {
  return connection
    .insert({
      article_id: articleId,
      author: newComment.username,
      body: newComment.body,
    })
    .into('comments')
    .returning('*')
    .then((commentData) => {
      return commentData[0];
    });
};

exports.updateCommentVotes = (commentId, updateBody) => {
  if (
    !updateBody.inc_votes ||
    typeof updateBody.inc_votes !== 'number' ||
    Object.keys(updateBody).length > 1
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return connection
    .from('comments')
    .where('comment_id', '=', commentId)
    .increment('votes', updateBody.inc_votes)
    .returning('*')
    .then((commentData) => {
      if (commentData.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      return commentData[0];
    });
};

exports.removeCommentById = (commentId) => {
  return connection
    .from('comments')
    .where('comment_id', commentId)
    .del()
    .then((deletedItems) => {
      if (deletedItems === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      return deletedItems;
    });
};

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
    .returning('*');
};

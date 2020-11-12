const {
  fetchCommentsByArticleId,
  createComment,
} = require('../models/comments');

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const sortBy = req.query.sort_by;
  const { order } = req.query;
  fetchCommentsByArticleId(articleId, sortBy, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  createComment(articleId, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

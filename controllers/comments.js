const {
  fetchCommentsByArticleId,
  createComment,
  updateCommentVotes,
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

exports.patchCommentVotes = (req, res, next) => {
  const commentId = req.params.comment_id;
  const { body } = req;
  updateCommentVotes(commentId, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      err.detail = 'Comment';
      next(err);
    });
};

const {
  fetchCommentsByArticleId,
  createComment,
  updateCommentVotes,
  removeCommentById,
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
    .catch((err) => {
      err.detail = 'Article';
      next(err);
    });
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

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      err.detail = 'Comment';
      next(err);
    });
};

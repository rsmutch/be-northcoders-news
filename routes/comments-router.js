const commentsRouter = require('express').Router();
const { invalidMethodError } = require('../controllers/errors');
const {
  patchCommentVotes,
  deleteCommentById,
} = require('../controllers/comments');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentVotes)
  .delete(deleteCommentById)
  .all(invalidMethodError);

module.exports = commentsRouter;

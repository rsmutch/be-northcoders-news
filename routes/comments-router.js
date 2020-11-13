const commentsRouter = require('express').Router();
const { invalidMethodError } = require('../controllers/errors');
const { patchCommentVotes } = require('../controllers/comments');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentVotes)
  .all(invalidMethodError);

module.exports = commentsRouter;

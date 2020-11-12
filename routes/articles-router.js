const articlesRouter = require('express').Router();
const {
  patchArticleVotes,
  deleteArticleById,
  getArticles,
} = require('../controllers/articles');
const {
  getCommentsByArticleId,
  postComment,
} = require('../controllers/comments');
const { invalidMethodError } = require('../controllers/errors');

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)
  .all(invalidMethodError);

articlesRouter
  .route('/:article_id')
  .get(getArticles)
  .delete(deleteArticleById)
  .patch(patchArticleVotes)
  .all(invalidMethodError);

module.exports = articlesRouter;

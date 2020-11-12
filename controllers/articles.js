const {
  fetchArticleById,
  updateArticleVotes,
  removeArticleById,
  fetchArticles,
} = require('../models/articles');

// CONTROLLER

exports.getArticles = (req, res, next) => {
  const articleId = req.params.article_id;
  const sortBy = req.query.sort_by;
  const { order } = req.query;
  fetchArticles(articleId, sortBy, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  updateArticleVotes(articleId, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  removeArticleById(articleId)
    .then((response) => {
      res.status(204).send();
    })
    .catch(next);
};

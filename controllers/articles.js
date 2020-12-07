const {
  fetchArticleById,
  updateArticleVotes,
  removeArticleById,
  fetchArticles,
  createArticle
} = require('../models/articles');

// CONTROLLER

exports.getArticles = (req, res, next) => {
  const articleId = req.params.article_id;
  const sortBy = req.query.sort_by;
  const { order, topic, author } = req.query;

  fetchArticles(articleId, sortBy, order, topic, author)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      err.detail = 'Article';
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  updateArticleVotes(articleId, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.detail = 'Article';
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  removeArticleById(articleId)
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      err.detail = 'Article';
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { body } = req;
  createArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

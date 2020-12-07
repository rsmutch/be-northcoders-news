const connection = require('../db/connection');

// MODEL

exports.fetchArticles = (articleId, sortBy, order, topic, author) => {
  if (sortBy === 'body') sortBy = 'article.body';
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  const articlesColumns = [
    'article_id',
    'title',
    'votes',
    'topic',
    'author',
    'created_at'
  ];
  const articleByIdColumns = ['article.body'];
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.votes',
      'articles.topic',
      'articles.author',
      'articles.created_at'
    )
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .modify((query) => {
      if (articleId) {
        query.select('articles.body').where('articles.article_id', articleId);
        if (
          !articlesColumns.includes(sortBy) &&
          !articleByIdColumns.includes(sortBy)
        ) {
          query.orderBy('created_at', order);
        } else {
          query.orderBy(sortBy, order);
        }
      } else {
        if (!articlesColumns.includes(sortBy)) {
          query.orderBy('created_at', order);
        } else {
          query.orderBy(sortBy, order);
        }
      }
      if (topic && !articleId) {
        query.where('topic', topic);
      }
      if (author && !articleId) {
        query.where('articles.author', author);
      }
    })
    .then((articleData) => {
      if (articleData.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      } else if (articleData[0].body) {
        return articleData[0];
      }
      return articleData;
    });
};

exports.updateArticleVotes = (articleId, updateBody) => {
  if (
    !updateBody.inc_votes ||
    typeof updateBody.inc_votes !== 'number' ||
    Object.keys(updateBody).length > 1
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return connection
    .from('articles')
    .where('article_id', '=', articleId)
    .increment('votes', updateBody.inc_votes)
    .returning('*')
    .then((articleData) => {
      if (articleData.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return articleData[0];
    });
};

exports.removeArticleById = (articleId) => {
  return connection
    .from('articles')
    .where('article_id', articleId)
    .del()
    .then((deletedItems) => {
      if (deletedItems === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return deletedItems;
    });
};

exports.createArticle = (newArticle) => {
  const { title, body, topic, author } = newArticle;
  return connection
    .insert({
      title: title,
      body: body,
      topic: topic,
      author: author
    })
    .into('articles')
    .returning('*')
    .then((addedArticle) => {
      return this.fetchArticles(addedArticle[0].article_id);
    });
};

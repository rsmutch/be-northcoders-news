const { fetchAllTopics, createTopic } = require('../models/topics');

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { body } = req;
  createTopic(body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

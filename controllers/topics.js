const fetchAllTopics = require('../models/topics');

const getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topics) => {
    console.log(topics)
    res.status(200).send({ topics });
  });
};

module.exports = { getAllTopics };

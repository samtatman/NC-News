const { fetchTopics } = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
  console.log("hi");
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

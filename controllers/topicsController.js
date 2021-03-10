const { fetchTopics } = require("../models/topicsModels");

exports.getTopics = (req, res, next) => {
  console.log("in the topics controller");
  fetchTopics().then((topics) => {
    console.log(topics, "***");
    res.status(200).send({ topics });
  });
};

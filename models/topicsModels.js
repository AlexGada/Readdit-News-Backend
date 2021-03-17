const dbConnection = require("../dbConnection");

exports.fetchTopics = () => {
  return dbConnection.select("*").from("topics");
};

exports.checkForTopics = (topic) => {
  return dbConnection
    .select("*")
    .from("topics")
    .where("slug", topic)
    .then((topics) => {
      if (topics.length === 0) return false;
      else return true;
    });
};

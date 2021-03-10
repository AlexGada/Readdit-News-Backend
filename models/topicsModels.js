const dbConnection = require("../dbConnection");

exports.fetchTopics = () => {
  return dbConnection("topics").select("*").from("topics");
};

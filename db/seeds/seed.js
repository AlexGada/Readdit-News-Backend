const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

// const { formatTime } = require("../utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("topics").insert(topicData).returning("*");
    })
    .then(() => {
      return knex("users").insert(userData).returning("*");
    })
    .then((timeStamp) => {
      console.log(articleData[0].created_at, "*** article data***");
      const readableTime = formatTime;

      return knex("articles").insert(articleData).returning("*");
    });
};

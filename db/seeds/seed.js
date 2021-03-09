const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatTime } = require("../utils/data-manipulation");
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
    .then(() => {
      const formattedArticles = formatTime(articleData);
      return knex("articles").insert(formattedArticles).returning("*");
    })
    .then(() => {
      //change the created_by key to author which = username - formatItems
      //change the belongs_to article_id
      //reformat created_at - formatTime
    });
};

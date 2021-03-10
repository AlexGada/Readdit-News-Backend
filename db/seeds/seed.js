const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const {
  formatTime,
  createRefObject,
  formatData,
} = require("../utils/data-manipulation");
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
    .then((articles) => {
      const articlesRefObject = createRefObject(
        articles,
        "title",
        "article_id"
      );

      const commentTime = formatTime(commentData);

      const formattedComments = formatData(
        commentTime,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        articlesRefObject
      );

      return knex("comments").insert(formattedComments);
    });
};

const { request } = require("express");
const dbConnection = require("../dbConnection");
const { checkForUsernames } = require("./usersModels");
const { checkForTopics } = require("./topicsModels");

exports.fetchTotalCount = (author, topic) => {
  return dbConnection
    .select("*")
    .from("articles")
    .modify((query) => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then((articles) => {
      return articles.length;
    });
};

exports.fetchArticles = (sort_by, order, author, topic, limit, p) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `Bad request - ${order} is not a valid order value!`,
    });
  }
  return dbConnection

    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(Number(limit) || 10)
    .modify((query) => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
      if (p > 1) {
        query.offset(Number(limit) * Number(p - 1) || 10 * Number(p - 1));
      }
    })
    .then((articles) => {
      if (articles.length === 0) {
        if (author && topic) {
          return Promise.all([
            articles,
            checkForUsernames(author),
            checkForTopics(topic),
          ]);
        } else if (author)
          return Promise.all([articles, checkForUsernames(author), true]);
        else if (topic) {
          return Promise.all([articles, true, checkForTopics(topic)]);
        }
      } else return [articles, true, true];
    })
    .then(([articles, userExists, topicExists]) => {
      if (!userExists) {
        return Promise.reject({
          status: 404,
          msg: `${author} is not a valid author!`,
        });
      }
      if (!topicExists) {
        return Promise.reject({
          status: 404,
          msg: `${topic} is not a valid topic!`,
        });
      }
      return articles;
    });
};

exports.fetchArticleByID = (id) => {
  return dbConnection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((articles) => {
      if (articles.length === 0)
        return Promise.reject({
          status: 404,
          msg: `${id} is not a valid article ID`,
        });
      else return articles[0];
    });
};

exports.fetchArticleComments = (article_id, sort_by, order, limit, p) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `Bad request - ${order} is not valid`,
    });
  }
  return dbConnection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(Number(limit) || 10)
    .modify((query) => {
      if (p > 1) {
        query.offset(Number(limit) * Number(p - 1) || 10 * Number(p - 1));
      }
    })
    .then((comments) => {
      if (comments.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      else return comments;
    });
};

exports.removeArticleByID = (id) => {
  return dbConnection("articles").where("article_id", id).del();
};

exports.editArticleByID = (id, incrementor) => {
  if (incrementor === undefined)
    return Promise.reject({
      status: 400,
      msg: "Bad request: no increment value provided",
    });
  if (typeof incrementor !== "number")
    return Promise.reject({
      status: 400,
      msg: `Bad request: ${incrementor} is not a number`,
    });
  return dbConnection
    .select("articles.*")
    .from("articles")
    .where("article_id", id)
    .increment("votes", incrementor)
    .returning("*")
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: `No article found with ID ${id}`,
        });
      const amendedArticle = article[0];
      if (amendedArticle.votes < 0) amendedArticle.votes = 0;

      return amendedArticle;
    });
};

exports.addArticleComments = (article_id, username, body) => {
  if (typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: `Bad request - ${body} is not in the correct format`,
    });
  }

  return dbConnection
    .select("username")
    .from("users")
    .then((users) => {
      const usernames = users.map((user) => {
        return user.username;
      });
      if (usernames.includes(username)) {
        return dbConnection
          .insert({
            author: username,
            body,
            article_id,
            created_at: new Date(),
          })
          .into("comments")
          .returning("*")
          .then((comment) => {
            return comment[0];
          });
      } else {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
      }
    });
};

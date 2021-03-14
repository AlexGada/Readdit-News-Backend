const { request } = require("express");
const dbConnection = require("../dbConnection");

exports.fetchArticles = ({ sort_by, order, author, topic }) => {
  return dbConnection

    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || author || topic || "created_at", order || "desc")
    .then((articles) => {
      // if (order !== "asc" && order !== "desc") {
      //   return Promise.reject({
      //     status: 400,
      //     msg: `Bad request - ${order} is not a valid order input`,
      //   });
      // }
      return articles;
    });
};

exports.fetchArticleByID = (id) => {
  console.log("in articles model");
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

exports.fetchArticleComments = (id, { sort_by, order }) => {
  console.log("in the article comments model");

  return dbConnection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("comments.article_id", id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((comments) => {
      return comments;
    });
};
//not getting comments

exports.removeArticleByID = (id) => {
  return dbConnection("articles").where("article_id", id).del();
};

exports.editArticleByID = (id, incrementor) => {
  console.log("in the patch articles model");

  return dbConnection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      const amendedArticle = article[0];

      if (typeof incrementor === "number") {
        amendedArticle.votes += incrementor;
        if (amendedArticle.votes < 0) amendedArticle.votes = 0;
        return amendedArticle;
      } else if (incrementor === undefined) {
        return Promise.reject({
          status: 400,
          msg: "Bad request: no increment value provided",
        });
      } else {
        return Promise.reject({
          status: 400,
          msg: `Bad request: ${incrementor} is not a number`,
        });
      }
    });
};

exports.addArticleComments = (newComment, id) => {
  console.log("in the add comment model");

  const username = newComment.username;
  const body = newComment.body;
  return dbConnection("comments")
    .insert({ author: username, body: body, article_id: id })
    .then(() => {
      return dbConnection.select("*").from("comments").where("body", body);
    })
    .then((comments) => {
      return comments[0];
    });
};

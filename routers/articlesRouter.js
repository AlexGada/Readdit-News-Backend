const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleByID,
  deleteArticleByID,
  patchByArticleID,
  getArticleComments,
  postArticleComments,
} = require("../controllers/articlesController");
const { handleInvalidMethods } = require("../errors");

articlesRouter.route("/").get(getArticles).all(handleInvalidMethods);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .delete(deleteArticleByID)
  .patch(patchByArticleID)
  .all(handleInvalidMethods);
articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComments)
  .all(handleInvalidMethods);

module.exports = articlesRouter;

//post not working and query path

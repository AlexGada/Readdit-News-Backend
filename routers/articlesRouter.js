const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleByID,
  deleteArticleByID,
  patchByArticleID,
  getArticleComments,
  postArticleComments,
} = require("../controllers/articlesController");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .delete(deleteArticleByID)
  .patch(patchByArticleID);
articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComments);

module.exports = articlesRouter;

//post not working and query path

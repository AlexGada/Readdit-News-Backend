const {
  patchCommentById,
  deleteCommentById,
  getCommentById,
} = require("../controllers/commentsController");
const { handleInvalidMethods } = require("../errors");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handleInvalidMethods);

module.exports = commentsRouter;

const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsController");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;

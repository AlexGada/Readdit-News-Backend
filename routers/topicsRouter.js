const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsController");
const { handleInvalidMethods } = require("../errors");

topicsRouter.route("/").get(getTopics).all(handleInvalidMethods);

module.exports = topicsRouter;

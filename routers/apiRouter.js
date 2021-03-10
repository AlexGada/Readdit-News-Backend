const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;

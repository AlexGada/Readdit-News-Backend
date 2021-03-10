const express = require("express");
const apiRouter = require("./routers/apiRouter.js");

const app = express();

app.use("/api", apiRouter);

module.exports = app;

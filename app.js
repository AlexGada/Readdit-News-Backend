const express = require("express");
const {
  handle400s,
  handle500s,
  handlePSQL,
  handleInvalidPaths,
  handleInvalidMethods,
} = require("./errors/index.js");
const apiRouter = require("./routers/apiRouter.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/*", handleInvalidPaths);

app.use(handleInvalidMethods);
app.use(handle400s);
app.use(handlePSQL);
app.use(handle500s);

module.exports = app;

const usersRouter = require("express").Router();
const { getUsers, getUsername } = require("../controllers/usersController");
const { handleInvalidMethods } = require("../errors");

usersRouter.route("/").get(getUsers).post(handleInvalidMethods);
usersRouter.get("/:username", getUsername);

module.exports = usersRouter;

const usersRouter = require("express").Router();
const { getUsers, getUsername } = require("../controllers/usersController");
const { handleInvalidMethods } = require("../errors");

usersRouter.route("/").get(getUsers).all(handleInvalidMethods);
usersRouter.route("/:username").get(getUsername).all(handleInvalidMethods);

module.exports = usersRouter;

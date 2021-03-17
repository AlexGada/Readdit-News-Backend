const { fetchUsers, fetchUsernames } = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const username = req.params.username;
  fetchUsernames(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

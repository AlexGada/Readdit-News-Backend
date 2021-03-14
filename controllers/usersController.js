const { fetchUsers, fetchUsernames } = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
  console.log("in the users controller");
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const username = req.params.username;
  fetchUsernames(username)
    .then((users) => {
      if (users.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `${username} is not a valid user`,
        });
      } else {
        const user = users[0];
        res.status(200).send({ user: user });
      }
    })
    .catch(next);
};

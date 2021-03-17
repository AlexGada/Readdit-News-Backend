const dbConnection = require("../dbConnection");

exports.fetchUsers = () => {
  return dbConnection.select("*").from("users");
};

exports.fetchUsernames = (username) => {
  return dbConnection
    .select("*")
    .from("users")
    .where("username", username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `${username} is not a valid user`,
        });
      } else return user[0];
    });
};

exports.checkForUsernames = (username) => {
  return dbConnection
    .select("*")
    .from("users")
    .where("username", username)
    .then((usersData) => {
      if (usersData.length === 0) return false;
      else return true;
    });
};

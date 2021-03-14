const dbConnection = require("../dbConnection");

exports.fetchUsers = () => {
  return dbConnection.select("*").from("users");
};

exports.fetchUsernames = (username) => {
  return dbConnection.select("*").from("users").where("username", username);
};

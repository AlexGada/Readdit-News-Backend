const dbConnection = require("../dbConnection");
exports.fetchCommentById = (comment_id) => {
  return dbConnection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .then((comment) => {
      if (comment.length === 0)
        return Promise.reject({
          status: 404,
          msg: `No comment found with the ID ${comment_id}`,
        });
      else return comment[0];
    });
};

exports.editCommentById = (comment_id, inc_votes) => {
  if (inc_votes === undefined)
    return Promise.reject({
      status: 400,
      msg: "Bad Request - invalid incrementor!",
    });
  if (typeof inc_votes !== "number")
    return Promise.reject({
      status: 400,
      msg: `Bad Request - ${inc_votes} is not a number!`,
    });
  return dbConnection
    .from("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((comments) => {
      if (comments.length === 0)
        return Promise.reject({
          status: 404,
          msg: `No comment found with the ID ${comment_id}`,
        });
      else return comments[0];
    });
};

exports.removeCommentById = (comment_id) => {
  // if (typeof comment_id != "number")
  //   return Promise.reject({
  //     status: 400,
  //     msg: `Bad Request - ${comment_id} is not a valid comment ID!`,
  //   });
  // else
  return dbConnection
    .delete()
    .from("comments")
    .where("comment_id", comment_id)
    .returning("*")
    .then((comment) => {
      if (comment.length === 0)
        return Promise.reject({
          status: 404,
          msg: `No comment found with the ID ${comment_id}`,
        });
    });
};

exports.up = function (knex) {
  console.log("creating user table");
  return knex.schema.createTable("users", (userTable) => {
    userTable.string("username").primary();
    userTable.string("avatar_url");
    userTable.string("name").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping user table");
  return knex.schema.dropTable("users");
};

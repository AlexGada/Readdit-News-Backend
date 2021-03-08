exports.up = function (knex) {
  console.log("creating comment table");
  return knex.schema.createTable("comments", (commentTable) => {
    commentTable.increments("comment_id").primary();
    commentTable.string("author").references("users.username").notNullable();
    commentTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentTable.integer("votes").defaultsTo(0).notNullable();
    commentTable.string("body").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping comment table");
  return knex.schema.dropTable("comments");
};
exports.up = function (knex) {
  console.log("creating article table");
  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.string("body").notNullable();
    articleTable.integer("votes").defaultTo(0).notNullable();
    articleTable.string("topic").references("topics.slug").notNullable();
    articleTable.string("author").references("users.username").notNullable();
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  console.log("dropping article table");
  return knex.schema.dropTable("articles");
};

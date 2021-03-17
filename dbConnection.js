const knex = require("knex");
const dbConfig = require("./knexfile");
const ENV = process.env.NODE_ENV || "development";

const dbConnection =
  ENV === "production"
    ? {
        client: "pg",
        connection: {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : knex(dbConfig);

module.exports = dbConnection;

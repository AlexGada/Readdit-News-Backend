const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
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
    : require("./knexfile");

module.exports = knex(dbConfig);

// testing connection settings
// const knex = require("knex");
// const dbConfig = require("./knexfile");
// const ENV = process.env.NODE_ENV || "development";

// const dbConnection =
//   ENV === "production"
//     ? {
//         client: "pg",
//         connection: {
//           connectionString: process.env.DATABASE_URL,
//           ssl: {
//             rejectUnauthorized: false,
//           },
//         },
//       }
//     : knex(dbConfig);

// module.exports = dbConnection;

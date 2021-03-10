const knex = require("knex");
const dbConfig = require("./knexfile");

const dbConnection = knex(dbConfig);

module.exports = dbConnection;

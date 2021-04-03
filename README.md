# Readdit News

## Background

- This is an API built for the reddit-inspired app Readdit news and is hosted [here](https://https://readdit-news.herokuapp.com/api) on Heroku.
- The API uses an express server, the data is stored on a PSQL database and knex is used to access the data.

## How to use

_CLONING_

- In the command line in the directory you want the repository stored, type `git clone https://github.com/AlexGada/be-nc-news` to clone the repository to your operating system.

### Dependencies

_Node.js_

- Ensure you have the latest version of Node (v15.3.0) installed onto your operating system. Click [here](https://nodejs.org/en/download/) to install Node.

_PSQL_

- Ensure you have the latest version of PSQL (12.6) downloaded to your operating system. Click [here](https://www.postgresql.org/download/) to install PSQL.

_Express_

- In the repository terminal install express by running `npm i express`.

_Knex_

- Postgres knex is required, in the repository terminal install Knex by running `npm i knex pg`

_Jest_

- Dev dependencies of Jest required for testing, in the repository terminal install Jest by running `npm i -D jest`

_Jest Sorted_

- Dev dependencies of Jest sorted required for testing, in the repository terminal install Jest-sorted by running `npm i -D jest-sorted`

_Supertest_

- Dev dependencies of supertest required for testing, in the repository terminal install supertest by running `npm i -D supertest`

_Seeding_

- Run terminal command: npm run setup-dbs to initialise database
- Run terminal command: npm run migrate-rollback to clear tables
- Run terminal command: npm run migrate-latest to populate tables

_Testing_

- app functionality (endpoints and error handling) can be tested using Jest with the tests written in the app.tests.js file.
- Utils used for seeding can be tested using Jest with the tests written in the utils.test.js file

_knexfile.js_

- Use the formatting below to create a root level knexfile (add the file to the **.gitignore** to ensure personal information remains private)

````json const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";
const baseConfig = {
client: "pg",
migrations: {
directory: "./db/migrations",
},
seeds: {
directory: "./db/seeds",
},
};
const customConfigs = {
development: {
connection: { database: "nc_news",
username: "YOUR PSQL USERNAME", // Mac users do not require this
password: "YOUR PSQL PASSWORD" }, // Mac users do not require this
},
test: {
connection: {
database: "nc_news_test",
username: "YOUR PSQL USERNAME", // Mac users do not require this
password: "YOUR PSQL PASSWORD", // Mac users do not require this
},
},
production: {
connection: {
connectionString: DB_URL,
ssl: {
rejectUnauthorized: false,
},
},
},
};
module.exports = { ...baseConfig, ...customConfigs[ENV] }; ```

## Data

The data is split into 4 tables in the PSQL database:

_TOPICS_ :

- _slug_ - the tables unique primary key string
- _description_ - string description of the topics

_USERS_:

- username - the users primary key string
- avatar_url - optional link to avatar images
- name - users name

_ARTICLES_

- article_id - articles primary key integer
- title - article title strings
- topic - topic referencing topics primary key (slug)
- body - string forming the article contents
- author - references users primary key (username)
- votes - integer vote count defaulting to 0
- created_at - timestamp for the time of article creation

_COMMENTS_

- comment_id - comments primary key integer
- article_id - references the articles primary key
- body - string forming the comments contents
- author - references users primary key (username)
- votes - cot count defaulting to 0
- created_at - timestamp for the time of comment creation

## Endpoints

### **/api**

_GET_

- Serves a json representation of all the available endpoints of the api

### **/api/topics**

_GET_

- Serves an array of all topics

### **/api/users**

_GET_

- Serves an array of all the users

_POST_

- Adds a new user and serves the updated array of users

### **/api/users/:username**

_GET_

- Serves an object with the usernames user data

### **/api/articles**

_GET_

- Serves an array of all articles

### **/api/articles/:article_id**

_GET_

- Serves an object containing the article matching article_id

_PATCH_

- Updates the vote count by the number passed to inc_votes on the request body on the article matching the article_id, then serves an object containing the updated article

### **/api/articles/:article_id/comments**

_GET_

- Serves an array of objects containing each comment of the article matching the passed article_id

_POST_

- Adds a comment to the article matching the article_id, then serves an object containing the new comment

### **/api/comments/:comment_id**

_GET_

- Serves an object containing the comment matching the comment_id

_PATCH_

- Updates the vote count on the comment matching the comment_id by amount passed as inc_votes through the body of the request, then serves an object containing the updated comment

_DELETE_

- Deletes the comment matching comment_id

````

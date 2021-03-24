# Readdit News

## Background

- This is an API built for the reddit-inspired app Readdit news and is hosted [here](https://https://readdit-news.herokuapp.com/api) on Heroku.
- The API uses an express server, the data is stored on a PSQL database and knex is used to access the data.

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

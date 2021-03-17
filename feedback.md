## CODE

### migrations

- really nice tidy, well constrained migrations!
- don't need `unique` and `primary` together

### seeding

- great flat promise chains
- some unnecessary `returning("*")`

### utils

- a few dodgy naming of vars and funcs eg. `correctTime = []`, `formatData` vs `formatItems` sounds like the same thing!
- great testing!

### app

- really nice and tidy

### routes

- very well organised and easy to follow

### controllers

- wouldn't expect comment controllers in articles file
- inconsistent use of `Promise.reject()` aim to define a single place to do this. Either models or controllers
- really nice otherwise!

### models

- `.orderBy(sort_by || author || topic || "created_at", order || "desc")` - this line isn't quite right. remember what the author/topic query are. You've got them in an `orderby` method (see failing tests below)
- `editArticleByID` ISN'T WORKING. What your logic is doing is getting the article, and then changing the value on the object. These changes aren't persistant. If you were to do GET req for this article again, you'd find that the patch has had no effect. Look at the knex method`increment`.
- `addArticleComments`- shouldn't need to do a `select` to get the new article out, how did you get access to the thing you inserted in your _seed func_?

### errors

- `handlePSQL` not all PSQL error codes map to a 400 unfortunately, you may have to be more thorought in you if statement.
- In general though some great separation of error logic!

### misc

- remove stale console.logs as you go

## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

in the topics controller
in the topics controller
in our handle 400s

### PATCH `/api/topics`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### GET `/api/articles?author=butter_bridge`

Assertion: Cannot read property 'every' of undefined - _reference to every is from test! (array not coming back)_

Hints:

- accept an `author` query of any author that exists in the database
- use `where` in the model

### GET `/api/articles?topic=mitch`

Assertion: Cannot read property 'every' of undefined - _reference to every is from test! (array not coming back)_

Hints:

- accept an `topic` query of any topic slug that exists in the database
- use `where` in the model

### GET `/api/articles?author=lurker`

Assertion: expected 400 to equal 200

Hints:

- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the user exists

### GET `/api/articles?topic=paper`

Assertion: expected 400 to equal 200

Hints:

- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the topic exists

### GET `/api/articles?topic=not-a-topic`

Assertion: expected 400 to equal 404

Hints:

- use a 404 status code, when provided a non-existent topic
- use a separate model to check whether the topic exists

### GET `/api/articles?author=not-an-author`

Assertion: expected 400 to equal 404

Hints:

- use a 404 status code, when provided a non-existent author
- use a separate model to check whether the author exists

### PATCH `/api/articles`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### PUT `/api/articles/1`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### PATCH `/api/articles/1`

Assertion: expected 400 to equal 200

Hints:

- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
- provide a default argument of `0` to the `increment` method, otherwise it will automatically increment by 1

### GET `/api/articles/1000/comments`

Assertion: expected 200 to equal 404

Hints:

- return 404: Not Found when given a valid `article_id` that does not exist

### PUT `/api/articles/1/comments`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### POST `/api/articles/1/comments`

Assertion: expected { Object (comments) } to contain key 'comment'

Hints:

- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README

### POST `/api/articles/1/comments`

Assertion: Cannot read property 'votes' of undefined

Hints:

- default `votes` to `0` in the migrations
- default `created_at` to the current time in the migrations

### POST `/api/articles/1/comments`

Assertion: **ERROR WITH NO CATCH: CHECK YOUR CONTROLLERS!**

### POST `/api/articles/10000/comments`

Assertion: **ERROR WITH NO CATCH: CHECK YOUR CONTROLLERS!**

### POST `/api/articles/not-a-valid-id/comments`

Assertion: **ERROR WITH NO CATCH: CHECK YOUR CONTROLLERS!**

### PATCH `/api/comments/1`

Assertion: expected 404 to equal 200

Hints:

- use a 200: OK status code for successful `patch` requests

### PATCH `/api/comments/1`

Assertion: expected { msg: 'Route not found' } to contain key 'comment'

Hints:

- send the updated comment back to the client in an object, with a key of comment: `{ comment: {} }`

### PATCH `/api/comments/1`

Assertion: Cannot read property 'votes' of undefined

Hints:

- increment / decrement the `votes` of the specified article with the knex method **`increment`**

### PATCH `/api/comments/1`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request status code when sent an invalid `inc_votes` value

### PATCH `/api/comments/1`

Assertion: expected 404 to equal 200

Hints:

- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body

### PATCH `/api/comments/not-a-valid-id`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request when `PATCH` contains an invalid comment_id

### PATCH `/api/comments/1`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request status code when sent an invalid `inc_votes` value

### PUT `/api/comments/1`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### DELETE `/api/comments/1`

Assertion: expected 404 to equal 204

Hints:

- use a 204: No Content status code
- do not return anything on the body

### DELETE `/api/comments/not-a-number`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request when `DELETE` contains an invalid comment_id

### PUT `/api/users/butter_bridge`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

### DELETE `/api`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

# BE Northcoders News Check List

## Readme

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `knexfile.js`
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [ ] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)

## Migrations

- [ ] Use `notNullable` on required fields
- [ ] Default `created_at` in articles and comments tables to the current date:`.defaultTo(knex.fn.now());`
- [ ] Delete all comments when the article they are related to is deleted: Add `.onDelete("CASCADE");` to `article_id` column in `comments` table.

## Seeding

- [ ] Make sure util functions do not mutate data
- [ ] Make util functions easy to follow with well named functions and variables
- [ ] Test util functions
- [ ] Migrate rollback and migrate latest in seed function

## Tests

- [ ] Cover all endpoints and errors
- [ ] Ensure all tests are passing

## Routing

- [ ] Split into api, topics, users, comments and articles routers
- [ ] Use `.route` for endpoints that share the same path
- [ ] Use `.all` for 405 errors

## Controllers

- [ ] Name functions and variables well
- [ ] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- [ ] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [ ] No unnecessary use of `.modify()` (i.e. only for author and topic queries)
- [ ] Use `leftJoin` for comment counts

## Errors

- [ ] Use error handling middleware functions in app and extracted to separate directory/file
- [ ] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics

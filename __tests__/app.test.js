process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const dbConnection = require("../dbConnection");

beforeEach(() => dbConnection.seed.run());
afterAll(() => dbConnection.destroy());

describe("/api", () => {
  describe("GET", () => {
    it("status 200: successfully responds with a JSON object of the endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          console.log(endpoints);
          expect(typeof endpoints).toBe("object");
        });
    });
    describe("Errors", () => {
      it("status 405: Invalid Methods", () => {
        const methods = ["post", "patch", "delete", "put"];
        const promises = methods.map((method) => {
          return request(app)
            [method]("/api")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid method");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("status 200: successfully fetches topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics[0]).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
      });
      describe("Errors", () => {
        it("status 404: Not found - Invalid path ", () => {
          return request(app)
            .get("/api/banana")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Route not found");
            });
        });
        it("status 405: Invalid Methods", () => {
          const methods = ["post", "patch", "delete", "put"];
          const promises = methods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe("Invalid method");
              });
          });
          return Promise.all(promises);
        });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("status 200: successfully fetches users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users[0]).toMatchObject({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            });
          });
      });
      describe("Errors", () => {
        it("status 404: Not found - Invalid path ", () => {
          return request(app)
            .get("/api/oranges")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Route not found");
            });
        });
        it("status 405: Invalid Methods", () => {
          const methods = ["post", "patch", "delete", "put"];
          const promises = methods.map((method) => {
            return request(app)
              [method]("/api/users")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe("Invalid method");
              });
          });
          return Promise.all(promises);
        });
      });
      describe("/users/:username", () => {
        describe("GET", () => {});
        it("status 200: successfully fetches user info by usernames", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).toEqual({
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny",
              });
            });
        });
        describe("Errors", () => {
          it("status 404: Not found - Invalid username", () => {
            return request(app)
              .get("/api/users/JimAndDaveOrAntAndDec")
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe(
                  "JimAndDaveOrAntAndDec is not a valid user"
                );
              });
          });
          it("status 405: Invalid Methods", () => {
            const methods = ["post", "patch", "delete", "put"];
            const promises = methods.map((method) => {
              return request(app)
                [method]("/api/users")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).toBe("Invalid method");
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("status 200: successfully fetches articles with correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            });
          });
      });
      it("status 200: successfully responds with the total_count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("total_count");
          });
      });
      it("status 200: default sorts articles by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      describe("Errors", () => {
        it("status 404: Not found - Invalid path ", () => {
          return request(app)
            .get("/api/banana")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Route not found");
            });
        });
        it("status 405: Invalid Methods", () => {
          const methods = ["post", "patch", "delete", "put"];
          const promises = methods.map((method) => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe("Invalid method");
              });
          });
          return Promise.all(promises);
        });
      });
      describe("Queries", () => {
        it("status 200: accepts query to be sorted by any valid column, defaulting in descending order", () => {
          const columns = [
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count",
          ];
          const promises = columns.map((column) => {
            return request(app)
              .get(`/api/articles?sort_by=${column}`)
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).toBeSortedBy(column, {
                  descending: true,
                  coerce: true,
                });
              });
          });
          return Promise.all(promises);
        });
        it("status 200: accepts query to be sorted by any valid column in ascending order", () => {
          const validColumns = [
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count",
          ];
          const sortPromises = validColumns.map((column) => {
            return request(app)
              .get(`/api/articles?sort_by=${column}&order=asc`)
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).toBeSortedBy(column, {
                  descending: false,
                  coerce: true,
                });
              });
          });
          return Promise.all(sortPromises);
        });
        it("status 200: accepts query to sort articles by username", () => {
          return request(app)
            .get("/api/articles?author=rogersop")
            .expect(200)
            .then(({ body: { articles } }) => {
              const authorFilter = articles.every((article) => {
                return article.author === "rogersop";
              });
              expect(authorFilter).toBe(true);
            });
        });
        it("status 200: accepts query to sort articles by topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              const topicFilter = articles.every((article) => {
                return article.topic === "mitch";
              });
              expect(topicFilter).toBe(true);
            });
        });
        it("status 200: responds with an empty array when passed a valid username for an author who has no articles", () => {
          return request(app)
            .get("/api/articles?author=lurker")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toEqual([]);
            });
        });
        it("status 200: responds with an empty array when passed a valid topic with no articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toEqual([]);
            });
        });
        it("status 200: successfully defaults the number of articles to 10", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBeLessThanOrEqual(10);
            });
        });
        it("status 200: accepts query to increase the default number of articles", () => {
          return request(app)
            .get("/api/articles?limit=16")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBeLessThanOrEqual(16);
            });
        });
        it("status 200: accepts query to decrease the default number of articles", () => {
          return request(app)
            .get("/api/articles?limit=3")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBeLessThanOrEqual(3);
            });
        });
        it("status 200: when passed an invalid limit value, the default overrides the query", () => {
          return request(app)
            .get("/api/articles?limit=pear")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBeLessThanOrEqual(10);
            });
        });
        it("status 200: accepts query to start at a specific page when the limit is provided", () => {
          return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body: { articles } }) => {
              const p2Articles = articles.every((article) => {
                return article.article_id <= 20 && article.article_id > 10;
              });
              expect(p2Articles).toBe(true);
            });
        });
        it("status 200: accepts query to start at a specific page when the limit is not provided", () => {
          return request(app)
            .get("/api/articles?limit=5&p=2")
            .expect(200)
            .then(({ body: { articles } }) => {
              const p2Articles = articles.every((article) => {
                return article.article_id <= 10 && article.article_id > 5;
              });
              expect(p2Articles).toBe(true);
            });
        });
        it("status 200: when passed an invalid page value, the default overrides the query", () => {
          return request(app)
            .get("/api/articles?p=porridge")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].article_id).toBe(1);
            });
        });
        it("status 200: total_count displays correct count when used in a query", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).toBe(11);
            });
        });
        it("status 200: accepts all queries simultaneously", () => {
          return request(app)
            .get(
              "/api/articles?sort_by=article_id&order=asc&author=rogersop&topic=mitch&limit=4&p=1"
            )
            .expect(200)
            .then(({ body: { articles } }) => {
              const topicFilter = articles.every((article) => {
                return article.topic === "mitch";
              });
              const authorFilter = articles.every((article) => {
                return article.author === "rogersop";
              });
              const p2Articles = articles.every((article) => {
                return article.article_id <= 10 && article.article_id > 0;
              });

              expect(articles).toBeSortedBy("article_id", {
                descending: false,
              });
              expect(topicFilter).toBe(true);
              expect(authorFilter).toBe(true);
              expect(articles[0].article_id).toBe(4);
              expect(articles.length).toBeLessThanOrEqual(4);
              expect(p2Articles).toBe(true);
            });
        });
        describe("Query Errors", () => {
          it("status 400: Bad request - invalid column to sort by provided", () => {
            return request(app)
              .get("/api/articles?sort_by=banana")
              .expect(400)
              .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad request" });
              });
          });
          it("status 400: Bad request - invalid order input provided", () => {
            return request(app)
              .get("/api/articles?order=orange")
              .expect(400)
              .then(({ body }) => {
                expect(body).toEqual({
                  msg: "Bad request - orange is not a valid order value!",
                });
              });
          });
          it("status 404: Not found - input to author query is not a valid username", () => {
            return request(app)
              .get("/api/articles?author=sausages")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("sausages is not a valid author!");
              });
          });

          it("status 404: Not found - input to topic is not a valid topic", () => {
            return request(app)
              .get("/api/articles?topic=pineapple_pizza")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(`pineapple_pizza is not a valid topic!`);
              });
          });
          it("status 405: Invalid Method", () => {
            const methods = ["post", "patch", "delete", "put"];
            const promises = methods.map((method) => {
              return request(app)
                [method]("/api/articles")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).toBe("Invalid method");
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
    describe("/articles/:article_id", () => {
      it("status 405: Invalid Methods", () => {
        return request(app)
          .post("/api/articles/3")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid method");
          });
      });
      describe("GET", () => {
        it("status 200: successfully fetches an article by its ID", () => {
          return request(app)
            .get("/api/articles/3") //test for specifics
            .then(({ body: { article } }) => {
              expect(article).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                body: "some gifs",
                votes: 0,
                topic: "mitch",
                author: "icellusedkars",
                created_at: "2010-11-17T12:21:54.171Z",
                comment_count: "0",
              });
            });
        });
        it("status 200: default sorts articles by date in descending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
      });
      describe("PATCH", () => {
        it("status 200: successfully responds with updated comments with the votes increased", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 12 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toMatchObject({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                body: "some gifs",
                votes: 12,
                topic: "mitch",
                author: "icellusedkars",
                created_at: "2010-11-17T12:21:54.171Z",
              });
            });
        });
        it("status 200: successfully responds with updated comments with the votes decreased without going below 0", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: -50 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toMatchObject({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                votes: 0,
                topic: "cats",
                author: "rogersop",
                created_at: "2002-11-19T12:21:54.171Z",
              });
            });
        });
        describe("Errors", () => {
          it("status 400: Bad request - Invalid incrementor value", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "falafel" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request: falafel is not a number");
              });
          });
          it("status 400: Bad request - No incrementor provided", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ hungry: "falafel" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request: no increment value provided");
              });
          });
        });
      });
      describe("DELETE", () => {
        it("status 204: successfully deletes article by ID", () => {
          return request(app)
            .delete("/api/articles/3")
            .expect(204)
            .then(() => {
              return request(app)
                .get("/api/articles/3")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("3 is not a valid article ID");
                });
            });
        });
        describe("Errors", () => {
          it("status 404: Not found - invalid article id provided", () => {
            return request(app)
              .get("/api/articles/1234")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("1234 is not a valid article ID");
              });
          });
          it("status 400: Bad request - invalid article id format provided", () => {
            return request(app)
              .get("/api/articles/fish")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request");
              });
          });
        });
      });
    });
    describe("/articles/:article_id/comments", () => {
      describe("GET", () => {
        it("status 200: fetches all comments by article id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .then(({ body: { comments } }) => {
              expect(comments[0]).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              });
            });
        });
        describe("Errors", () => {
          it("status 404: Not found - Invalid ID", () => {
            return request(app)
              .get("/api/articles/123456")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("123456 is not a valid article ID");
              });
          });
          it("status 400: Bad request - Invalid ID format", () => {
            return request(app)
              .get("/api/articles/orange")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request");
              });
          });
        });
        describe("Queries", () => {
          it("status 200: default sorts article comments by date in descending order", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          it("status 200: accepts query to order article comments by date", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=created_at")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          it("status 200: accept query to order article comments in ascending order", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                  ascending: true,
                });
              });
          });
          it("status 200: accepts queries to sort by any valid column, in default descending order", () => {
            const column = [
              "comment_id",
              "author",
              "votes",
              "created_at",
              "body",
            ];
            const promises = column.map((column) => {
              return request(app)
                .get(`/api/articles/1/comments?sort_by=${column}`)
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toBeSortedBy(column, {
                    descending: true,
                    coerce: true,
                  });
                });
            });
            return Promise.all(promises);
          });
          it("status 200: accepts queries to sort by any valid column, in ascending order", () => {
            const column = [
              "comment_id",
              "author",
              "votes",
              "created_at",
              "body",
            ];
            const promises = column.map((column) => {
              return request(app)
                .get(`/api/articles/1/comments?sort_by=${column}&order=asc`)
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toBeSortedBy(column, {
                    descending: false,
                    coerce: true,
                  });
                });
            });
            return Promise.all(promises);
          });
          it("status 200: successfully defaults to 10 article comments", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBeLessThanOrEqual(10);
              });
          });
          it("status 200: accepts query to increase number of article comments", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=16")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBeLessThanOrEqual(16);
              });
          });
          it("status 200: accepts query to decrease number of article comments", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=5")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBeLessThanOrEqual(5);
              });
          });
          it("status 200: accepts query to start at a certain page when no limit is provided", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=comment_id&order=asc&p=2")
              .expect(200)
              .then(({ body: { comments } }) => {
                const p2Comments = comments.every((comment) => {
                  return comment.comment_id <= 20 && comment.comment_id > 10;
                });
                expect(p2Comments).toBe(true);
              });
          });
          it("status 200: accepts query to start at a certain page when limit is provided", () => {
            return request(app)
              .get(
                "/api/articles/1/comments?sort_by=comment_id&order=asc&limit=5&p=2"
              )
              .expect(200)
              .then(({ body: { comments } }) => {
                const p2Comments = comments.every((comment) => {
                  return comment.comment_id <= 11 && comment.comment_id > 6;
                });
                expect(p2Comments).toBe(true);
              });
          });
          describe("Query Errors", () => {
            it("status 400: Bad Request - invalid column", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=tiger")
                .expect(400)
                .then(({ body }) => {
                  expect(body).toEqual({ msg: "Bad request" });
                });
            });
            it("status 400: Bad request - invalid order value", () => {
              return request(app)
                .get("/api/articles/1/comments?order=random")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toEqual("Bad request - random is not valid");
                });
            });
          });
        });
      });
      describe("PATCH", () => {
        it("status 200: successfully updates the comments votes", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 6 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).toEqual(6);
            });
        });
        it("status 200: successfully updates comments votes without letting the votes get below 0", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: -12 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).toEqual(0);
            });
        });
        describe("Errors", () => {
          it("status 400: Bad request - invalid incrementor ", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: "orange" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request: orange is not a number");
              });
          });
          it("status 400: Bad request - no incrementor provided", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ name: "dave" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request: no increment value provided");
              });
          });
        });
      });
      describe("DELETE", () => {
        it("status 204: successfully deletes an article by article id", () => {
          return request(app)
            .delete("/api/articles/3")
            .expect(204)
            .then(() => {
              return dbConnection
                .select("*")
                .from("articles")
                .where("article_id", 3);
            })
            .then((article) => {
              expect(article).toHaveLength(0);
            });
        });
        describe("Errors", () => {
          it("status 204: No content - invalid ID number", () => {
            return request(app).delete("/api/articles/12345").expect(204);
          });
          it("status 400: Bad request - invalid ID format", () => {
            return request(app)
              .delete("/api/articles/orange")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request");
              });
          });
        });
      });
      describe("POST", () => {
        it.only("status 201: successfully posts a comment on the correct article with all the correct keys", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "icellusedkars",
              body: "wow Alex is just the best",
            })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(Object.keys(comment)).toEqual(
                expect.arrayContaining([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body",
                ])
              );
            });
        });
        describe("Errors", () => {
          it("status 400: Not found - invalid username", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "probablynotavaliduser",
                body: "besurprisedifthisworks",
              })
              .expect(400)
              .then(({ body }) => {
                expect(body).toEqual({
                  msg: "Bad request",
                });
              });
          });
        });
      });
    });
  });

  describe("/comments/comment_id", () => {
    describe("PATCH", () => {
      it("status 200: successfully responds with updated comments with the votes increased", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: 12 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toMatchObject({
              comment_id: 3,
              author: "icellusedkars",
              article_id: 1,
              votes: 112,
              created_at: "2015-11-23T12:36:03.389Z",
              body:
                "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            });
          });
      });
      it("status 200: successfully responds with updated comments with the votes decreased ", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: -12 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toMatchObject({
              comment_id: 3,
              author: "icellusedkars",
              article_id: 1,
              votes: 88,
              created_at: "2015-11-23T12:36:03.389Z",
              body:
                "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            });
          });
      });
      describe("Errors", () => {
        it("status 400: Bad request - invalid inc_votes value provided", () => {
          return request(app)
            .patch("/api/comments/4")
            .send({ inc_votes: "papaya" })
            .expect(400)
            .then(({ body }) => {
              expect(body).toMatchObject({
                msg: "Bad Request - papaya is not a number!",
              });
            });
        });
        it("status 400: Bad request - no inc_votes provided", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ name: "David" })
            .expect(400)
            .then(({ body }) => {
              expect(body).toMatchObject({
                msg: "Bad Request - invalid incrementor!",
              });
            });
        });
      });
    });
    describe("DELETE", () => {
      it("status 204: successfully deletes comment by ID", () => {
        return request(app)
          .delete("/api/comments/9")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/comments/9")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("No comment found with the ID 9");
              });
          });
      });
      describe("Errors", () => {
        it("status 405: Invalid Methods", () => {
          const invalidMethods = ["post", "put"];
          const requestPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe("Invalid method");
              });
          });
          return Promise.all(requestPromises);
        });
        it("status 404: Not found - invalid comments_id provided", () => {
          return request(app)
            .delete("/api/comments/123452")
            .expect(404)
            .then(({ body }) => {
              expect(body).toMatchObject({
                msg: `No comment found with the ID 123452`,
              });
            });
        });
        it("status 400: Bad request - invalid comments_id format provided", () => {
          return request(app)
            .delete("/api/comments/mangos")
            .expect(400)
            .then(({ body }) => {
              expect(body).toMatchObject({
                msg: `Bad request`,
              });
            });
        });
      });
    });
  });
  describe("/invalid_route", () => {
    it("status 404: Invalid route", () => {
      const methods = ["get", "post", "patch", "put", "delete"];
      const methodPromises = methods.map((method) => {
        return request(app)
          [method]("/this_isnt_a_route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Route not found");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});

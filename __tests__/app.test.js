process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const dbConnection = require("../dbConnection");
const { get } = require("../routers/topicsRouter");

beforeEach(() => dbConnection.seed.run());
afterAll(() => dbConnection.destroy());

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it("status: 200, successfully fetches topics", () => {
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
      it("status: 404, given a non-existent path, returns an error message ", () => {
        return request(app)
          .get("/api/banana")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Route not found");
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("status: 200, successfully fetches users", () => {
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
      it("status: 200, successfully fetches user info by usernames", () => {
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
      it("status: 404, given an invalid username provides an appropriate error message", () => {
        return request(app)
          .get("/api/users/JimAndDaveOrAntAndDec")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(
              "JimAndDaveOrAntAndDec is not a valid user"
            );
          });
      });
      it("status: 405, trying an invalid method returns an error message", () => {
        return request(app)
          .post("/api/users")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid method");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("status: 200, successfully fetches articles", () => {
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
      describe("Queries", () => {
        it("status 200: default sorts articles by date in descending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at", { descending: true });
            });
        });
        it("status: 200, accepts query to sort articles by date", () => {
          return request(app)
            .get("/api/articles?sort_by=created_at&order=desc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at", { descending: true });
            });
        });
        it("status: 200, accepts query to sort articles by username", () => {
          return request(app)
            .get("/api/articles?author=author")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("author", {
                descending: true,
              });
            });
        });
        it("status 200: accepts query to sort articles by topic", () => {
          return request(app)
            .get("/api/articles?topic=topic")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("topic", {
                descending: true,
              });
            });
        });
        xit("status 400: Bad request - invalid order request", () => {
          return request(app)
            .get("/api/articles?order=orange")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                `Bad request - orange is not a valid order input`
              );
            });
        });
        it("status 200: default sorts article comments by date in descending order", () => {
          return request(app)
            .get("/api/articles/3/comments")
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
              expect(comments).toBeSortedBy("created_at", { descending: true });
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
        it("status 200: accepts query to order article comments by ascending and created at simultaneously", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=created_at&order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("created_at", {
                ascending: true,
              });
            });
        });
      });
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
      xit("status: 400, gives an error message when ID doesn't exist", () => {
        return request(app)
          .get("/api/articles/orange")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      xit("status: 404, gives an error when passed an invalid ID number", () => {
        return request(app)
          .get("/api/articles/123456")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("123456 is not a valid article ID");
          });
      });
    });
    describe("PATCH", () => {
      it("status 200: responds with updated article object when passed negative number of votes, not letting the vote count fall below 0", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -12 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).toEqual(0);
          });
      });
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
    describe("DELETE", () => {
      it("delete an article by article id", () => {
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
    describe("POST", () => {
      it("status 201: successfully posts a comment on an article based on the ID", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "icellusedkars",
            body: "wow Alex is just the best",
          })
          .expect(201)
          .then(({ body: { comments } }) => {
            expect(comments.body).toBe("wow Alex is just the best");
          });
      });
    });
  });
});

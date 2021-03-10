process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const dbConnection = require("../dbConnection");

beforeEach(() => dbConnection.seed.run());
afterAll(() => dbConnection.destroy());

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it("status: 200 fetches topics", () => {
        return request(app).get("/api/topics").expect(200);
      });
    });
  });
});

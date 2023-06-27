const request = require("supertest");
const app = require("./app");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const descriptions = require("../endpoints.json")

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  it("Should return all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toEqual(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
});

describe("GET /api/", () => {
    it("Should respond with an object describing all the available endpoints on the API", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
         expect(body).toEqual(descriptions)
        });
    });
  });
  


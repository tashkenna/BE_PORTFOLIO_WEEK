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
const descriptions = require("../endpoints.json");

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
        expect(body).toEqual(descriptions);
      });
  });
});

describe("GET /api/articles:id", () => {
  it("Should return an article object by its ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("Should return a 404 error when ID does not exist", ()=> {
    return request(app)
    .get("/api/articles/190")
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  })
  it("Should return a 400 error when ID is invalid format", ()=> {
    return request(app)
    .get("/api/articles/onetwo")
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  })
});

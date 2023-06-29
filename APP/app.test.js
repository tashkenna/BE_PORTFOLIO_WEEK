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
  it("Should return a 404 error when ID does not exist", () => {
    return request(app)
      .get("/api/articles/190")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  it("Should return a 400 error when ID is invalid format", () => {
    return request(app)
      .get("/api/articles/onetwo")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });
});

describe("GET /api/articles", () => {
  it("returns an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  it("Articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /app/articles/:article_id/comments", () => {
  it("Gets all comments for an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(11);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toEqual(1)
        });
      });
  });

  it("Responds with a 404 error when ID doesn't exist", () => {
    return request(app)
      .get("/api/articles/3453/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  it("Responds with a 400 error when ID is in an invalid format", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });

  it("Responds with a 200 error when a valid article is requested but it doesn't have any comments yet", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Valid article ID, no comments found");
      });
  })
 });


describe("POST /api/articles/:article_id/comments", () => {
  it("Should add a comment for an article.", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "TestComment",
      })
      .expect(201)
      .then(({ body }) => {
          expect(body).toHaveProperty("comment");
          expect(body.comment).toHaveProperty("comment_id");
          expect(body.comment).toHaveProperty("author");
          expect(body.comment).toHaveProperty("body");
          expect(body.comment).toHaveProperty("article_id");
          expect(body.comment).toHaveProperty("created_at");
          expect(body.comment.article_id).toEqual(1)
          expect(body.comment.author).toEqual("lurker")
          expect(body.comment.body).toEqual("TestComment")
  
        });
      });
    it("Should return a 400 error if the request body is missing values", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "TestComment",
      })
      .expect(400)
      .then(({body})=> {
        expect(body.msg).toBe("Bad request");
      });
    })

    it("Should return a 400 error if the username does not exist", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "user123",
        body: "TestComment",
      })
      .expect(400)
      .then(({body})=> {
        expect(body.msg).toBe("Username does not exist");
      });
    })

    it("Should return a 400 error if ID is invalid type", () => {
      return request(app)
      .post("/api/articles/invalid/comments")
      .send({
        username: "lurker",
        body: "TestComment",
      })
      .expect(400)
      .then(({body})=> {
        expect(body.msg).toBe("Invalid ID type");
      });
    })

    it("Should return a 400 error if ID is valid type but doesn't exist", () => {
      return request(app)
      .post("/api/articles/99999/comments")
      .send({
        username: "lurker",
        body: "TestComment",
      })
      .expect(400)
      .then(({body})=> {
        expect(body.msg).toBe("ID does not exist");
      });
    })

    it("Responds with a 400 error if request is made with a valid body, username, but includes and extra property", () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "TestComment",
        more: "Things"
      })
      .expect(400)
      .then(({body})=> {
        expect(body.msg).toBe("Bad request, extra properties");
      });
    })
    })

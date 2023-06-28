const express = require("express");
const { getTopics, getEndpoints, getArticlesByID, getArticles, getApi, getCommentsByArticleID } = require("./controller");
const app = express();
const descriptions = require("../endpoints.json");

app.get("/api/", getApi)

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)



app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid ID" });
    } else next(err);
  });

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});



module.exports = app;

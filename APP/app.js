const express = require("express");
const { getTopics, getEndpoints, getArticlesByID, getArticles, getApi, getCommentsByArticleID, postCommentByArticleID, deleteCommentByCommentID } = require("./controller");
const app = express();
const descriptions = require("../endpoints.json");

app.use(express.json());

app.get("/api/", getApi)

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.post("/api/articles/:article_id/comments", postCommentByArticleID)

app.delete("/api/comments/:comment_id", deleteCommentByCommentID)


app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid ID type" });
    } 
    if(err.code === "23502") {
      res.status(400).send({msg: "Bad request"})
    }
    if(err.code === "23503" && err.constraint === 'comments_author_fkey') {
      res.status(400).send({msg: "Username does not exist"})
    }
    if(err.code === "23503" && err.constraint === 'comments_article_id_fkey') {
      res.status(400).send({msg: "ID does not exist"})
    }
      else next(err);
  });

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});



module.exports = app;

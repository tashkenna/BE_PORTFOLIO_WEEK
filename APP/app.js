const express = require("express");
const { getTopics, getArticlesByID, getArticles, getUsers, getApi, getCommentsByArticleID, postCommentByArticleID, deleteCommentByCommentID } = require("./controller");
const app = express();
const { handlePsqlErrors } = require("./handlePsqlErrors");
const cors = require('cors')

app.use(cors());

app.use(express.json());

app.get("/api/", getApi)

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.post("/api/articles/:article_id/comments", postCommentByArticleID)

app.delete("/api/comments/:comment_id", deleteCommentByCommentID)



app.use(handlePsqlErrors);

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});



module.exports = app;

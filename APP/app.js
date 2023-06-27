const express = require("express");
const { getTopics, getEndpoints, getArticles } = require("./controller");
const app = express();
const descriptions = require('../endpoints.json')

app.get("/api/", (req, res) => {
    res.status(200).send(descriptions)
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles)


module.exports = app;

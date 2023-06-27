const express = require("express");
const { getTopics, getEndpoints } = require("./controller");
const app = express();
const descriptions = require('../endpoints.json')

app.get("/api/topics", getTopics);

app.get("/api/", (req, res) => {
    res.status(200).send(descriptions)
});

module.exports = app;

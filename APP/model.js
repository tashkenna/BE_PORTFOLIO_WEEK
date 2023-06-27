const db = require("../db/connection");
const endpoints = require('../endpoints.json')

exports.selectTopics = () => {
  return db
    .query(
      `SELECT
    topics.description,
    topics.slug
FROM
    topics
`
    )
    .then(({ rows }) => {
      return rows;
    });
};


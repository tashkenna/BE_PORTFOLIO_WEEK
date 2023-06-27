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

exports.selectArticles = (id) => {
  return db
  .query(
    `SELECT * FROM articles WHERE article_id = $1`, [id]
  )
  .then( ({rows}) => {
    return rows[0]
  })
}
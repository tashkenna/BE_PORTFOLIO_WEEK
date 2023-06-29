const db = require("../db/connection");

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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
ORDER BY articles.created_at DESC
;
  `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticlesByID = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleID = (id) => {
  return db
    .query(
      `SELECT
  comment_id,
  votes,
  created_at,
  author,
  body,
  article_id
FROM
  comments
WHERE
  article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query("SELECT * FROM articles WHERE article_id = $1", [id])
          .then(({ rows }) => {
            if (rows.length > 0) {
            return Promise.reject({ status: 200, msg: "Valid article ID, no comments found" });;
            }
            return Promise.reject({ status: 404, msg: "Not found" });
          });
      }
      return rows;
    });
};

exports.insertCommentByArticleID = (id, username, body) => {
 

  return db
    .query(
      `INSERT INTO comments(
    author, 
    body, 
    article_id

  ) 

  VALUES ($1, $2, $3)
  RETURNING comment_id, author, body, article_id, created_at`,
      [username, body, id]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentByCommentID = (id) => {
return db
.query(`
DELETE FROM comments 
WHERE comment_id = $1 
RETURNING *
`, [id])
.then(({row}) => {
  if (row === undefined) {
    return db
      .query("SELECT * FROM comments WHERE article_id = $1", [id])
      .then(({ rows }) => {
        if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Valid ID type but no comment found" });;
        }
  return row
})
}
})}
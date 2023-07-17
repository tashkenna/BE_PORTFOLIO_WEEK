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

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {

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
 ${topic ? `WHERE articles.topic = '${topic}'` : ""}
GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
ORDER BY ${sort_by} ${order}
;
  `
    )
    .then(({ rows }) => {
        if(rows.length === 0){
        return db.query(`SELECT * FROM topics WHERE topics.slug = '${topic}';`)
        .then(({rows})=> {
        if(rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
        } return []
      })
      } 
   
      return rows;
    });
};



exports.selectUsers = () => {
  return db
  .query(
    `SELECT users.username,
    users.name,
    users.avatar_url FROM users;

    `
  )
  .then(({rows}) => {
    
    return rows
  }) 
}


exports.selectArticlesByID = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.countComments = (articleID) => {
  return db
  .query(`SELECT COUNT(*) AS comment_count
  FROM comments
  WHERE comments.article_id = $1;
`,
  [articleID]
  )
  .then(({rows})=> {
    return rows[0].comment_count;
  })
}

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
            if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "Not found" });
            }
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
  

  exports.updateArticleById = (id, inc_votes) => {
    return db
      .query(
        `
    UPDATE articles
    SET votes = votes + $1 
    WHERE article_id = $2
    RETURNING *
    `,
        [inc_votes, id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 400, msg: "ID does not exist" });
        }
        return rows[0];
      });
  };
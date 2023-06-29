const {
  selectTopics,
  selectArticlesByID,
  selectArticles,
  selectCommentsByArticleID,
  insertCommentByArticleID,
  updateArticleById,
} = require("./model");
const descriptions = require("../endpoints.json");

exports.getApi = (req, res) => {
  res.status(200).send(descriptions);
};
exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getArticles = (req, res) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body, ...extraProp } = req.body;
  if (Object.keys(extraProp).length > 0) {
    return res.status(400).send({ msg: "Bad request, extra properties" });
  }
  insertCommentByArticleID(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes, ...extraProp } = req.body;
  if (Object.keys(extraProp).length > 0) {
    return res.status(400).send({ msg: "Bad request, extra properties" });
  }
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

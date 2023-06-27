const { selectTopics, selectArticlesByID, selectArticles } = require("./model");
const descriptions = require("../endpoints.json");


exports.getApi = (req, res) => {
  res.status(200).send(descriptions)
}
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
    res.status(200).send({ articles })
  })
  .catch((err) => {
    console.log(err);
  });
}

exports.getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesByID(article_id)
  .then((article) => {
    res.status(200).send({article})
  })
  .catch((err) => {
    next(err)
  });
}

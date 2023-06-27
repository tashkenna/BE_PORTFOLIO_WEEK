const { selectTopics, selectArticles } = require("./model");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(article_id)
  .then((article) => {
    res.status(200).send({article})
  })
  .catch((err) => {
    next(err)
  });
}

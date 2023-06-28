const { selectTopics, selectArticlesByID, insertIntoRestaurants } = require("./model");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

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

exports.postArticleComments = (req, res, next) => {
  const body = req.body; 
  insertIntoRestaurants(body)
  .then((response) => {
    res.status(201).send({comment: response})
  })
}
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid ID type" });
    } 
    if(err.code === "23502") {
      res.status(400).send({msg: "Bad request"})
    }
    if(err.code === "42601") {
      res.status(400).send({msg: "Bad request"})
    }
    if(err.code === '42703') {
      res.status(400).send({msg: "Bad request"})
    }
    if(err.code === "23503" && err.constraint === 'comments_author_fkey') {
      res.status(400).send({msg: "Username does not exist"})
    }
    if(err.code === "23503" && err.constraint === 'comments_article_id_fkey') {
      res.status(400).send({msg: "ID does not exist"})
    }

      else next(err);
  }
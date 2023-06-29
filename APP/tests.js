app.use((err, req, res, next) => {
    
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Not found" });
    }
    if (err.code === "22003") {
      res.status(400).send({ msg: "Not found" });
    }
    if (err.code === "23502") {
      res.status(400).send({ msg: "Not found" });
    }
    if (err.code === "23503" && err.constraint === "comments_author_fkey") {
      res.status(400).send({ msg: "Not found" });
    }
    if (err.code === "23503" && err.constraint === "comments_article_id_fkey") {
      res.status(400).send({ msg: "Not found" });
    } else next(err);
  });
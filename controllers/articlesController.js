const {
  fetchArticles,
  fetchArticleByID,
  fetchArticleComments,
  removeArticleByID,
  editArticleByID,
  addArticleComments,
} = require("../models/articlesModels");

exports.getArticles = (req, res, next) => {
  console.log("in the getArticles controller");

  fetchArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  console.log("in the getArticlesByID controller");
  const id = req.params.article_id;
  fetchArticleByID(id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  console.log("in the comment controller");
  const id = req.params.article_id;
  const queries = req.query;
  fetchArticleComments(id, queries)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteArticleByID = (req, res, next) => {
  console.log("in the delete articles controller");
  const id = req.params.article_id;
  removeArticleByID(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchByArticleID = (req, res, next) => {
  const id = req.params.article_id;
  const incrementor = req.body.inc_votes;

  editArticleByID(id, incrementor)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  console.log("in the post article controller");
  const newComment = req.body;
  const id = req.params.article_id;
  addArticleComments(newComment, id).then((comments) => {
    res.status(201).send({ comments });
  });
};

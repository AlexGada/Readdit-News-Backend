const {
  fetchArticles,
  fetchArticleByID,
  fetchArticleComments,
  removeArticleByID,
  editArticleByID,
  addArticleComments,
  fetchTotalCount,
} = require("../models/articlesModels");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  fetchArticles(sort_by, order, author, topic, limit, p)
    .then((articles) => {
      fetchTotalCount(author, topic).then((total_count) => {
        res.status(200).send({ articles, total_count });
      });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  ("in the getArticlesByID controller");
  const id = req.params.article_id;
  fetchArticleByID(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { sort_by, order, limit, p } = req.query;
  const { article_id } = req.params;
  fetchArticleComments(article_id, sort_by, order, limit, p)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteArticleByID = (req, res, next) => {
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
  const { article_id } = req.params;
  const { username, ...body } = req.body;
  addArticleComments(article_id, username, body)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch(next);
};

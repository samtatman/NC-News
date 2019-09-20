const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchCommentsByArticleId,
  fetchArticles,
  checkIfTopicExists,
  checkIfUsernameExists
} = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentByArticleId(article_id, comment)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  let { sort_by, order_by } = req.query;
  if (order_by !== "asc" && order_by !== "desc") order_by = "desc";
  fetchCommentsByArticleId(article_id, sort_by, order_by)
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  let { sort_by, order_by, author, topic } = req.query;
  if (order_by !== "asc" && order_by !== "desc") order_by = "desc";
  fetchArticles(sort_by, order_by, author, topic)
    .then(articles => {
      return res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

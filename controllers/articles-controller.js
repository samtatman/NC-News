const {
  fetchArticleById,
  updateArticleById
} = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleById(article_id).then(article => {
    res.status(200).send({ article });
  });
};

const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles-controller");

const { invalidMethod } = require("../error-handlers");

const articlesRouter = require("express").Router();
articlesRouter
  .route("/")
  .get(getArticles)
  .all(invalidMethod);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethod);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(invalidMethod);

module.exports = articlesRouter;

const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles-controller");

const { handleInvalidMethod } = require("../error-handlers");

const articlesRouter = require("express").Router();
articlesRouter
  .route("/")
  .get(getArticles)
  .all(handleInvalidMethod);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handleInvalidMethod);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(handleInvalidMethod);

module.exports = articlesRouter;

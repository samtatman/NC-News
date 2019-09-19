const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/comments-controller");
const { invalidMethod } = require("../db/utils/utils");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(invalidMethod);

module.exports = commentsRouter;

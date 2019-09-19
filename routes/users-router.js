const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controller");
const { handleInvalidMethod } = require("../error-handlers");
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handleInvalidMethod);

module.exports = usersRouter;

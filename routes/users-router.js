const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controller");
const { invalidMethod } = require("../error-handlers");
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethod);

module.exports = usersRouter;

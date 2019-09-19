const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controller");
const { invalidMethod } = require("../db/utils/utils");
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethod);

module.exports = usersRouter;

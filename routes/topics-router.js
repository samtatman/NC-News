const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller.js");
const { handleInvalidMethod } = require("../error-handlers");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(handleInvalidMethod);

module.exports = topicsRouter;

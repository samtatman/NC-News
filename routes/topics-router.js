const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller.js");
const { invalidMethod } = require("../error-handlers");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(invalidMethod);

module.exports = topicsRouter;

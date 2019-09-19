const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller.js");
const { invalidMethod } = require("../db/utils/utils");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(invalidMethod);

module.exports = topicsRouter;

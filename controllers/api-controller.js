const endpoints = require("../endpoints.json");
exports.getJSON = (req, res, next) => {
  res.json({ endpoints });
};

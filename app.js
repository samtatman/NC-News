const express = require("express");
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handleSQLErrors,
  handleUnhandledErrors
} = require("./error-handlers");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route does not exist." });
});

app.use(handleSQLErrors);

app.use(handleCustomErrors);

app.use(handleUnhandledErrors);

module.exports = app;

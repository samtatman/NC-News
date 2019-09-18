exports.handleCustomErrors = (err, req, res, next) => {
  if (("status", "msg" in err)) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
  const ref = {
    "22P02": "Invalid input syntax",
    "42703": "Column does not exist",
    "23503": "Value given is not present in referred tables"
  };
  if (err.code) {
    if (err.detail) {
      res.status(400).send({ msg: err.detail });
    }
    res.status(400).send({ msg: ref[err.code] });
  } else next(err);
};

exports.handleUnhandledErrors = (err, req, res, next) => {
  console.log(oof);
  res.status(500).send({ msg: "oof" });
};

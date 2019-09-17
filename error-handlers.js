exports.handleCustomErrors = (err, req, res, next) => {
  if (("status", "msg" in err)) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
  const ref = { "22P02": "Invalid input syntax" };
  if (err.code) {
    res.status(400).send({ msg: ref[err.code] });
  } else next(err);
};

exports.handleUnhandledErrors = (err, req, res, next) => {
  console.log(oof);
  res.status(500).send({ msg: "oof" });
};

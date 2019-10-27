exports.handleCustomErrors = (err, req, res, next) => {
  if (("status", "msg" in err)) {
    return res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
  const ref = {
    "22P02": "Invalid input syntax",
    "42703": "Column does not exist",
    "23503": "Value given is not present in referred tables",
    "23502": "Missing key in patch/post request"
  };
  if (err.code) {
    if (err.code === "23502") res.status(400).send({ msg: ref[err.code] });
    if (err.detail && err.code === "23503") {
      return res.status(404).send({ msg: err.detail });
    }
    if (err.detail) {
      return res.status(400).send({ msg: err.detail });
    }
    return res.status(400).send({ msg: ref[err.code] });
  } else next(err);
};

exports.handleUnhandledErrors = (err, req, res, next) => {
  return res.status(500).send({ msg: "Unhandled Error" });
};

exports.errorIfInputNotExist = (array, input = "Input") => {
  if (array.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `${input} does not exist in database`
    });
  } else return array;
};

exports.handleInvalidMethod = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

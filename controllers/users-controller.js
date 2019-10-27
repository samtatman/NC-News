const { fetchUserByUsername } = require("../models/users-model");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(([user]) => {
      return res.status(200).send({ user });
    })
    .catch(next);
};

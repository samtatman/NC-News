const { updateComment, removeComment } = require("../models/comments-model");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;

  updateComment(comment_id, inc_votes)
    .then(comment => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(deleteCount => {
      if (deleteCount) return res.sendStatus(204);
      else return Promise.reject({ status: 404, msg: "Input does not exist" });
    })
    .catch(next);
};

const connection = require("../db/connection");
const { errorIfInputNotExist } = require("../db/utils/utils");

exports.updateComment = (comment_id, inc_votes) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => errorIfInputNotExist(comment));
};

exports.removeComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del();
};

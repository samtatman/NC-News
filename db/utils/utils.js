exports.formatDates = list => {
  return list.map(element => {
    const newElement = { ...element };
    newElement.created_at = new Date(newElement.created_at);
    return newElement;
  });
};

exports.makeRefObj = (list, key1, key2) => {
  return list.reduce((obj, elem) => {
    obj[elem[key1]] = elem[key2];
    return obj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const newComment = { ...comment };
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.created_at = new Date(newComment.created_at);
    return newComment;
  });
};

exports.errorIfInputNotExist = array => {
  if (array.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Input does not exist in database"
    });
  } else return array;
};

exports.invalidMethod = (req, res, next) => {
  res.status(400).send({ msg: "Invalid method" });
};

exports.formatDates = list => {
  return list.map(element => {
    element.created_at = new Date(element.created_at);
    return element;
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
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.created_at = new Date(comment.created_at);
    return comment;
  });
};

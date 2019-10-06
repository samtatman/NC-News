const connection = require("../db/connection");
exports.checkIfThingExists = (thing, columnName, table) => {
  if (thing) {
    return connection
      .select("*")
      .from(table)
      .where({ [columnName]: thing })
      .then(array => {
        if (!array.length) {
          return Promise.reject({
            status: 404,
            msg: `${columnName} does not exist in database`
          });
        } else return true;
      });
  } else return null;
};

exports.checkIfArticleExists = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(array => {
      if (!array.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist"
        });
      } else return null;
    });
};

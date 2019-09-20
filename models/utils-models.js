const connection = require("../db/connection");
exports.checkIfThingExists = (thing, columnName, table) => {
  return connection
    .select("*")
    .from(table)
    .where({ [columnName]: thing })
    .then(array => {
      if (!array.length) {
        return Promise.reject({
          status: 404,
          msg: "Input does not exist in database"
        });
      } else return true;
    });
};

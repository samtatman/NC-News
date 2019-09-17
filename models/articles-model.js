const connection = require("../db/connection");
exports.fetchArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Id does not exist." });
      } else return article;
    })
    .then(([article]) => {
      console.log("hello");
      console.log(article.title);
      const commentPromise = connection
        .select("*")
        .from("comments")
        .where({ article_id: article.article_id });

      return Promise.all([commentPromise, article]);
    })
    .then(([commentPromise, article]) => {
      console.log(commentPromise);
      article.commentCount = commentPromise.length;
      return [article];
    });
};

exports.updateArticleById = article_id => {
  return connection;
};

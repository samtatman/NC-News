const connection = require("../db/connection");
const { errorIfIdNotExist } = require("../db/utils/utils");
exports.fetchArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(article => errorIfIdNotExist(article))
    .then(([article]) => {
      const commentPromise = connection
        .select("*")
        .from("comments")
        .where({ article_id: article.article_id });

      return Promise.all([commentPromise, article]);
    })
    .then(([commentPromise, article]) => {
      article.commentCount = commentPromise.length;
      return [article];
    });
};

exports.updateArticleById = (article_id, inc_value) => {
  return connection
    .increment("votes", inc_value)
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(article => errorIfIdNotExist(article));
};

exports.insertCommentByArticleId = (article_id, comment) => {
  comment.article_id = article_id;
  comment.author = comment.username;
  delete comment.username;
  return connection
    .insert(comment)
    .into("comments")
    .returning("*");
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = "comment_id",
  order_by = "asc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order_by)
    .then(comments => errorIfIdNotExist(comments));
};

exports.fetchArticles = (sort_by = "created_at") => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by);
};

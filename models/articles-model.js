const connection = require("../db/connection");
const { errorIfInputNotExist } = require("../error-handlers.js");
const { checkIfThingExists } = require("./utils-models");
exports.fetchArticleById = article_id => {
  return connection
    .select("articles.*")
    .count({ commentCount: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then(article => errorIfInputNotExist(article));
};

exports.updateArticleById = (article_id, inc_value) => {
  return connection
    .increment("votes", inc_value)
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(article => errorIfInputNotExist(article));
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
  sort_by = "created_at",
  order_by = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order_by)
    .then(comments => errorIfInputNotExist(comments));
};

exports.fetchArticles = (
  sort_by = "created_at",
  order_by = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order_by)
    .modify(currentQuery => {
      if (author) {
        currentQuery.where({ "articles.author": author });
      }
      if (topic) {
        currentQuery.where({ topic });
      }
    })
    .then(articles => {
      if (!articles.length && topic && author) {
        return Promise.all([
          articles,
          checkIfThingExists(topic, "slug", "topics"),
          checkIfThingExists(author, "username", "users")
        ]);
      }
      if (!articles.length && topic) {
        return Promise.all([
          articles,
          checkIfThingExists(topic, "slug", "topics")
        ]);
      }
      if (!articles.length && author) {
        return Promise.all([
          articles,
          checkIfThingExists(author, "username", "users")
        ]);
      } else return [articles];
    })
    .then(([articles]) => {
      return articles;
    });
};

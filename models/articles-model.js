const connection = require("../db/connection");
const { errorIfInputNotExist } = require("../error-handlers.js");
exports.fetchArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(article => errorIfInputNotExist(article))
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
  const fetchPromise = connection
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
        currentQuery.where({ "articles.topic": topic });
      }
    });
};

exports.checkIfUsernameExists = username => {
  if (username) {
    return connection
      .select("*")
      .from("users")
      .where("username")
      .then(output => {
        if (!output.length)
          Promise.reject({ status: 404, err: "Username does not exist." });
      });
  } else return username;
};
exports.checkIfTopicExists = topic => {
  if (topic) {
    return connection
      .select("*")
      .from("topics")
      .where("topic")
      .then(output => {
        if (!output.length)
          Promise.reject({ status: 404, err: "Topic does not exist." });
      });
  } else return topic;
};

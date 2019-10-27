exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable
      .string("author")
      .references("users.username")
      .notNullable();
    articlesTable.text("body").notNullable();
    articlesTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articlesTable.timestamp("created_at");
    articlesTable.integer("votes").defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};

// migrations/20240227122139_update_news_table.js

exports.up = function (knex) {
  return knex.schema.alterTable("news", function (table) {
    table.longtext("body").collate("utf8mb4_unicode_ci").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("news", function (table) {});
};

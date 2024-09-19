// migrations/20240301000000_convert_body_column.js

exports.up = function (knex) {
  return knex.schema.alterTable("news", function (table) {
    table.longtext("body").collate("utf8mb4_general_ci").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("news", function (table) {});
};

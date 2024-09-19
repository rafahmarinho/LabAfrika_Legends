exports.up = function (knex) {
  return knex.schema.alterTable("donates", function (table) {
    table.string("cupom");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("donates", function (table) {
    table.dropColumn("cupom");
  });
};

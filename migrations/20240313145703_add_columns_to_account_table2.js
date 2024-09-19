exports.up = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.boolean("isStreamer").defaultTo(false).notNullable();
    table.string("popUpStreamer").notNullable().defaultTo("");
  });
};

exports.down = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.dropColumn("isStreamer");
    table.dropColumn("popUpStreamer");
  });
};

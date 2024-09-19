exports.up = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.dropColumn("isStream");
    table.dropColumn("popUpStreamer");
  });
};

exports.down = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.boolean("isStream").defaultTo(false);
    table.boolean("popUpStreamer").defaultTo(false);
  });
};

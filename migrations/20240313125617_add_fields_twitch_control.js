exports.up = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.boolean("isStream").defaultTo(false);
    table.string("popUpStreamer");
  });
};

exports.down = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.dropColumn("isStream");
    table.dropColumn("popUpStreamer");
  });
};

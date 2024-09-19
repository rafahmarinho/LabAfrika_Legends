exports.up = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.string("twitchLogin");
  });
};

exports.down = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.dropColumn("twitchLogin");
  });
};

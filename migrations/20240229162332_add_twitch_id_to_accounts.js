exports.up = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.string("twitchId");
  });
};

exports.down = function (knex) {
  return knex.schema.table("accounts", function (table) {
    table.dropColumn("twitchId");
  });
};

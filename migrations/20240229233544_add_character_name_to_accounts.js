exports.up = function (knex) {
  return knex.schema.alterTable("accounts", (table) => {
    table.string("characterToStream");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("characterToStream");
  });
};

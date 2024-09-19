/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("accounts", function (table) {
      table.boolean("twoFactorAuth").defaultTo(false);
    })
    .createTable("VerifyCode", function (table) {
      table.increments("id").primary();
      table.integer("code");
      table.integer("accountId").references("id").inTable("accounts");
      table.boolean("wasUsed").defaultTo(false);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("accounts", function (table) {
      table.dropColumn("twoFactorAuth");
    })
    .dropTable("VerifyCode");
};

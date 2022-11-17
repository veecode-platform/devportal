/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function up(knex) {
  await knex.schema.createTable('devservices_users', table => {
    table.uuid('id').primary();
    table.uuid('devservice_id')
    table
    .foreign('devservice_id')
    .references('id')
    .inTable('devservices')
    table.uuid('user_id')
    table
    .foreign('user_id')
    .references('id')
    .inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('devservices_users').then(() => {
    console.log('Table devservices_users dropped!');
  })
};

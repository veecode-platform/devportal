/**
 * @param {import('knex').Knex} knex
 */
 exports.up = async function up(knex) {
  await knex.schema.createTable('devservices', table => {
    table.uuid('id').primary();
    table.boolean('active');
    table.string('name');
    table.string('kong_service');
    table.text('description');
    table.string('redirect_url');
    table.string('creator');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('name');
    table.string('email');
    table.boolean('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })

};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('devservices').then(() => {
    console.log('Table devservices dropped!');
  })
  await knex.schema.dropTable('users').then(() => {
    console.log('Table users dropped!');
  })
};




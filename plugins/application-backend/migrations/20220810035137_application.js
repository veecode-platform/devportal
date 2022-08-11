

/**
 * @param {import('knex').Knex} knex
 */
 exports.up = async function up(knex) {
  await knex.schema.createTable('application', (table) => {
    table.uuid('id').primary();
    table.string('creator');
    table.string('name');
    table.string('serviceName');
    table.string('description');
    table.boolean('active');
    table.enum('statusKong', ['active', 'inactive']);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.string('consumerName');
  }).then(() => {
    console.log('Table application created!');
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    knex.destroy();
  })
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('application').then(() => {
    console.log('Table application dropped!');
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    knex.destroy();
  })
};

// export async function up(knex: Knex): Promise<void> {
//   await knex.schema.createTable('application', (table) => {
//     table.uuid('id').primary();
//     table.string('creator');
//     table.string('name');
//     table.string('serviceName');
//     table.string('description');
//     table.boolean('active');
//     table.enum('statusKong', ['active', 'inactive']);
//     table.timestamp('createdAt').defaultTo(knex.fn.now());
//     table.timestamp('updatedAt').defaultTo(knex.fn.now());
//     table.string('consumerName');
//   }).then(() => {
//     console.log('Table application created!');
//   }).catch((err) => {
//     console.log(err);
//   }).finally(() => {
//     knex.destroy();
//   })
// }


// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.dropTable('application').then(() => {
//     console.log('Table application dropped!');
//   }).catch((err) => {
//     console.log(err);
//   }).finally(() => {
//     knex.destroy();
//   })
// }


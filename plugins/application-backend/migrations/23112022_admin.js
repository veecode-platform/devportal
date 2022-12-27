/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  try {
    await knex.schema.createTable('services', table => {
      table.uuid('id').primary();
      table.string('name');
      table.boolean('active');
      table.string('description');
      table.string('redirectUrl');
      table.specificType('partnersId', 'TEXT[]');
      table.integer('rateLimiting');
      table.string("kongServiceName");
      table.string("kongServiceId");
      table.enu("securityType", ['none', 'key-auth', 'oauth2'],{useNative: true, enumName:'security_type'} ).defaultTo('none')
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('partners', table => {
      table.uuid('id').primary();
      table.string('name');
      table.boolean('active');
      table.string('email');
      table.string('celular');
      table.specificType('servicesId', 'TEXT[]');
      table.specificType('applicationId', 'TEXT[]'); //lista de applications criadas
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('applications', table => {
      table.uuid('id').primary();
      table.string('name');
      table.boolean('active');
      table.string('creator');
      table.specificType('servicesId', 'TEXT[]'); //lista de services que a application usa
      table.string('kongConsumerName');
      table.string('kongConsumerId');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('plugins', table => {
      table.uuid('id').primary();
      table.string('name');
      table.string('pluginId');
      table.boolean('active');
      table.uuid('service');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.foreign('service').references('services.id').onDelete('CASCADE');
    });
  } catch (e) {
    console.log('ERROR MIGRATE:UP ', e);
    return false;
  } finally {
    knex.destroy();
    return true;
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  try {
    await knex.schema.dropTable('plugins');
    await knex.schema.dropTable('services').raw('DROP TYPE security_type');
    await knex.schema.dropTable('partners');
    await knex.schema.dropTable('applications');

  } catch (e) {
    console.log('ERROR MIGRATE:DOWN', e);
    return false;
  } finally {
    knex.destroy();
    return true;
  }
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

/*await knex.schema.createTable('application', (table) => {
    table.uuid('id').primary();
    table.string('creator');
    table.string('name');
    table.specificType('serviceName', 'TEXT[]');
    table.string('description');
    table.boolean('active');
    table.specificType('consumerName', 'TEXT[]');
    table.enum('statusKong', ['active', 'inactive']);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  }).then(() => {
    console.log('Table application created!');
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    knex.destroy();
  })*/

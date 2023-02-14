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
      table.integer('rateLimiting');
      table.string('kongServiceName');
      table.string('kongServiceId');
      table
      .enu('securityType', ['none', 'key-auth', 'oauth2'], {
        useNative: true,
        enumName: 'security_type',
        })
        .defaultTo('none');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
      });
      
 
      await knex.schema.createTable('partners', table => {
        table.uuid('id').primary();
        table.string('name');
        table.boolean('active');
        table.string('email');
        table.string('phone');
        // lista de applications criadas
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
      });

 
      await knex.schema.createTable('applications', table => {
        table.uuid('id').primary();
        table.string('name');
        table.boolean('active');
        table.string('creator');// lista de services que a application usa
        table.string('externalId');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
      });
    await knex.schema.createTable('plugins', table => {
      table.uuid('id').primary();
      table.string('name');
      table.string('pluginId');
      table.boolean('active');
      table.uuid('service');
      table.specificType('parternId', 'TEXT');
      table.string('externalId');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.foreign('service').references('services.id').onDelete('CASCADE');
    });
    await knex.schema.alterTable('applications', table => {
      table.uuid('servicesId').unsigned().references('id').inTable('services');
      table.uuid('partnersId').unsigned().references('id').inTable('partners'); 
    })
    await knex.schema.alterTable('partners', table => {
      table.uuid('servicesId').unsigned().references('id').inTable('services')  
      table.uuid('applicationId').unsigned().references('id').inTable('applications') 
    })
    await knex.schema.alterTable('services', table => {
      table.uuid('partnersId').unsigned().references('id').inTable('partners')  
    })
    await knex.schema.alterTable('plugins', table => {
      table.uuid('partnersId').unsigned().references('id').inTable('partners')  
    })
  } catch (e) {
    console.log('ERROR MIGRATE:UP ', e);
    return false;
  } finally {
    knex.destroy();
  }
  return true;
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  try {
    await knex.schema.dropTable('plugins');
    await knex.schema.dropTable('services');
    await knex.schema.dropTable('services').raw('DROP TYPE security_type');
    await knex.schema.dropTable('partners');
    await knex.schema.dropTable('applications');
  } catch (e) {
    console.log('ERROR MIGRATE:DOWN', e);
    return false;
  } finally {
    knex.destroy();
  }
  return true;
};
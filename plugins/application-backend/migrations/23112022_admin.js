/**
 * @param {import('knex').Knex} knex
 */



exports.up = async function up(knex) {
  try {

    await knex.schema.createTable('service', table => {
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
      
 
      await knex.schema.createTable('partner', table => {
        table.uuid('id').primary();
        table.string('name');
        table.boolean('active');
        table.string('email');
        table.string('phone');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
      });

 
      await knex.schema.createTable('application', table => {
        table.uuid('id').primary();
        table.string('name');
        table.boolean('active');
        table.string('creator');// lista de service que a application usa
        table.string('externalId');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
      });
    await knex.schema.createTable('plugin', table => {
      table.uuid('id').primary();
      table.string('name');
      table.string('pluginId');
      table.boolean('active');
      table.uuid('service');
      table.string('externalId');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.foreign('service').references('service.id').onDelete('CASCADE');
    });


    // APPLICATION ASSOCIATE
    await knex.schema.createTable('application_partner', table => {
      table.uuid('id').primary();
      table.uuid('application_id').references('application.id')
      table.uuid('partner_id').references('partner.id');
    });


    await knex.schema.createTable('application_service', table => {
      table.uuid('id').primary();
      table.uuid('application_id').references('application.id')
      table.uuid('service_id').references('service.id');
    });

    // PARTNER ASSOCIATE
    await knex.schema.createTable('partner_service', table => {
      table.uuid('id').primary();
      table.uuid('partner_id').references('partner.id')
      table.uuid('service_id').references('service.id');
    });


    await knex.schema.createTable('partner_application', table => {
      table.uuid('id').primary();
      table.uuid('partner_id').references('partner.id')
      table.uuid('application_id').references('application.id');
    });

    // SERVICE ASSOCIATE 
    await knex.schema.createTable('service_partner', table => {
      table.uuid('id').primary();
      table.uuid('service_id').references('service.id')
      table.uuid('partner_id').references('partner.id');
    });
 






    
  
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
    await knex.schema.dropTable('plugin');
    await knex.schema.dropTable('service');
    await knex.schema.dropTable('service').raw('DROP TYPE security_type');
    await knex.schema.dropTable('partner');
    await knex.schema.dropTable('application');
  } catch (e) {
    console.log('ERROR MIGRATE:DOWN', e);
    return false;
  } finally {
    knex.destroy();
  }
  return true;
};
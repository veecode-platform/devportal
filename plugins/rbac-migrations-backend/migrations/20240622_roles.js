/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // const now = new Date().toISOString();
  // await knex('permission.role-metadata').insert({
  //   roleEntityRef: 'role:default/devportal-user',
  //   source: 'rest',
  //   description: 'Default role for devportal users',
  //   author: 'user:default/admin',
  //   modifiedBy: 'user:default/admin',
  //   createdAt: now,
  //   lastModified: now,
  // });

  // await knex('permission.policy-metadata').insert([
  //   { policy: '[group:default/platform-user, role:default/devportal-user]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, catalog-entity, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, catalog.entity.create, create, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, policy-entity, read, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, policy-entity, create, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, policy-entity, update, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, policy-entity, delete, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, cluster.explorer.read, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, cluster.explorer.public.environment.read, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, gitlab.pipelines.read, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, gitlab.pipelines.create, create, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, github.workflows.read, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, github.workflows.create, create, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, admin.access.read, read, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, apiManagement.access.read, read, deny]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, kong.service.manager.read, read, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, kong.service.manager.create, create, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, kong.service.manager.update, update, allow]', source: 'rest' },
  //   { policy: '[role:default/devportal-user, kong.service.manager.delete, delete, allow]', source: 'rest' },
  // ]);

};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // try {
  //   await knex('permission.policy-metadata')
  //   .where('policy', '[role:default/devportal-user, catalog.entity.create, create, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, policy-entity, read, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, policy-entity, create, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, policy-entity, update, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, policy-entity, delete, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, cluster.explorer.read, read, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, cluster.explorer.public.environment.read, read, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, gitlab.pipelines.read, read, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, gitlab.pipelines.create, create, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, github.workflows.read, read, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, github.workflows.create, create, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, admin.access.read, read, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, apiManagement.access.read, read, deny]')
  //   .orWhere('policy', '[role:default/devportal-user, kong.service.manager.read, read, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, kong.service.manager.create, create, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, kong.service.manager.update, update, allow]')
  //   .orWhere('policy', '[role:default/devportal-user, kong.service.manager.delete, delete, allow]')
  //   .orWhere('policy', '[group:default/platform-user, role:default/devportal-user]')
  //   .delete();
    
  //   await knex('permission.role-metadata')
  //     .where('roleEntityRef', 'role:default/devportal-user')
  //     .andWhere('source', 'rest')
  //     .delete();
  // } catch (e) {
  //   console.log('ERROR MIGRATE:DOWN', e);
  //   return false;
  // } finally {
  //   knex.destroy();
  // }
  return true;
};

/**
 * @param {import('knex').Knex} knex
 */

exports.up = function (knex) {
  const DEFAULT_USER_GROUP = process.env.DEFAULT_USER_GROUP || (process.env.NODE_ENV === 'development' ? 'devportal-user' : undefined);
  
  if(!DEFAULT_USER_GROUP) {
    throw new Error('DEFAULT_USER_GROUP is not defined');
  }

  return knex.transaction(trx => {
    return Promise.all([
      trx('permission.role-metadata').insert({
        roleEntityRef: 'role:default/devportal-user',
        source: 'rest',
        description: null,
        author: 'user:default/admin',
        modifiedBy: 'user:default/admin',
        createdAt: knex.fn.now(),
        lastModified: knex.fn.now(),
      }),
      trx('permission.policy-metadata').insert([
        {
          policy: '[role:default/devportal-user, catalog-entity, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, catalog.entity.create, create, deny]',
          source: 'rest',
        },
        {
          policy: '[role:default/devportal-user, policy-entity, read, deny]',
          source: 'rest',
        },
        {
          policy: '[role:default/devportal-user, policy-entity, create, deny]',
          source: 'rest',
        },
        {
          policy: '[role:default/devportal-user, policy-entity, update, deny]',
          source: 'rest',
        },
        {
          policy: '[role:default/devportal-user, policy-entity, delete, deny]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, cluster.explorer.read, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, cluster.explorer.public.environment.read, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, gitlab.pipelines.read, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, gitlab.pipelines.create, create, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, github.workflows.read, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, github.workflows.create, create, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, admin.access.read, read, deny]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, apiManagement.access.read, read, deny]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, kong.service.manager.read, read, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, kong.service.manager.create, create, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, kong.service.manager.update, update, allow]',
          source: 'rest',
        },
        {
          policy:
            '[role:default/devportal-user, kong.service.manager.delete, delete, allow]',
          source: 'rest',
        },
        {
          policy: `[group:default/${DEFAULT_USER_GROUP}, role:default/devportal-user]`,
          source: 'rest',
        },
      ]),
      trx('permission.casbin_rule').insert([
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'catalog-entity',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'catalog.entity.create',
          v2: 'create',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'policy-entity',
          v2: 'read',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'policy-entity',
          v2: 'create',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'policy-entity',
          v2: 'update',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'policy-entity',
          v2: 'delete',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'cluster.explorer.read',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'cluster.explorer.public.environment.read',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'gitlab.pipelines.read',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'gitlab.pipelines.create',
          v2: 'create',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'github.workflows.read',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'github.workflows.create',
          v2: 'create',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'admin.access.read',
          v2: 'read',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'apiManagement.access.read',
          v2: 'read',
          v3: 'deny',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'kong.service.manager.read',
          v2: 'read',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'kong.service.manager.create',
          v2: 'create',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'kong.service.manager.update',
          v2: 'update',
          v3: 'allow',
        },
        {
          ptype: 'p',
          v0: 'role:default/devportal-user',
          v1: 'kong.service.manager.delete',
          v2: 'delete',
          v3: 'allow',
        },
        {
          ptype: 'g',
          v0: `group:default/${DEFAULT_USER_GROUP}`,
          v1: 'role:default/devportal-user',
        },
      ]),
    ]);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.transaction(trx => {
    return Promise.all([
      trx('permission.role-metadata')
        .where('roleEntityRef', 'role:default/devportal-user')
        .del(),
      trx('permission.policy-metadata')
        .where('policy', 'like', '[role:default/devportal-user%]')
        .del(),
      trx('permission.policy-metadata')
        .where(
          'policy',
          `[group:default/${DEFAULT_USER_GROUP}, role:default/devportal-user]`,
        )
        .del(),
      trx('permission.casbin_rule')
        .where('v0', 'role:default/devportal-user')
        .del(),
      trx('permission.casbin_rule')
        .where('v0', `group:default/${DEFAULT_USER_GROUP}`)
        .andWhere('v1', 'role:default/devportal-user')
        .del(),
    ]);
  });
};

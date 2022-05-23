// import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
// import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
// import { Router } from 'express';
// import { PluginEnvironment } from '../types';

// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   const builder = await CatalogBuilder.create(env);
//   builder.addProcessor(new ScaffolderEntitiesProcessor());
//   const { processingEngine, router } = await builder.build();
//   await processingEngine.start();
//   return router;
// }


import { Entity } from '@backstage/catalog-model';
import { CatalogBuilder, createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import { createConditionFactory } from '@backstage/plugin-permission-node';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

//custom

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  apply: (resource: Entity, systemRef: string) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: (systemRef: string) => ({
    key: 'relations.partOf',
    value: systemRef,
  }),
});


export const isInSystem = createConditionFactory(isInSystemRule);

//end custom

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addPermissionRules(isInSystemRule);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}

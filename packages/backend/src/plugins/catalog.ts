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
import {
  GithubDiscoveryProcessor,
  GithubOrgReaderProcessor,
} from '@backstage/plugin-catalog-backend-module-github';
import {
  ScmIntegrations,
  DefaultGithubCredentialsProvider
} from '@backstage/integration';

import { Entity } from '@backstage/catalog-model';
import { CatalogBuilder, createCatalogPermissionRule } from '@backstage/plugin-catalog-backend/alpha';
import { createConditionFactory } from '@backstage/plugin-permission-node';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

// custom

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

// end custom

export default async function createPlugin(
env: PluginEnvironment,
): Promise<Router> {
const builder = await CatalogBuilder.create(env);
builder.setProcessingIntervalSeconds(300);
const integrations = ScmIntegrations.fromConfig(env.config);
const githubCredentialsProvider =
  DefaultGithubCredentialsProvider.fromIntegrations(integrations);
builder.addProcessor(
  GithubDiscoveryProcessor.fromConfig(env.config, {
    logger: env.logger,
    githubCredentialsProvider,
  }),
  GithubOrgReaderProcessor.fromConfig(env.config, {
    logger: env.logger,
    githubCredentialsProvider,
  }),
);
builder.addPermissionRules(isInSystemRule);
builder.addProcessor(new ScaffolderEntitiesProcessor());
const { processingEngine, router } = await builder.build();
await processingEngine.start();
return router;
}
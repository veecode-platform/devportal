import { CatalogClient } from '@backstage/catalog-client';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
// scaffolder-backend-module-utils roadie plugin
import {
  createZipAction,
  createSleepAction,
  createWriteFileAction,
  createAppendFileAction,
  createMergeJSONAction,
  createMergeAction,
  createParseFileAction,
  createSerializeYamlAction,
  createSerializeJsonAction,
  createJSONataAction,
  createYamlJSONataTransformAction,
  createJsonJSONataTransformAction,
  createReplaceInFileAction,
} from '@roadiehq/scaffolder-backend-module-utils';
import { ScmIntegrations } from '@backstage/integration';
import { parseJsonAction,createFileAction } from '@veecode-platform/backstage-plugin-scaffolder-backend-module-veecode-extensions';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const actions = [
    createZipAction(),
    createSleepAction(),
    createWriteFileAction(),
    createAppendFileAction(),
    createMergeJSONAction({}),
    createMergeAction(),
    createParseFileAction(),
    createSerializeYamlAction(),
    createSerializeJsonAction(),
    createJSONataAction(),
    createYamlJSONataTransformAction(),
    createJsonJSONataTransformAction(),
    createReplaceInFileAction(),
    parseJsonAction(),
    createFileAction(),
    ...createBuiltinActions({
   //   containerRunner,
      integrations,
      config: env.config,
      catalogClient,
      reader: env.reader,
    }),
  ];


  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    actions
  });
}


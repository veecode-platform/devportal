import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-search-backend-module-catalog';
import { Router } from 'express';
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-search-backend-module-techdocs';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const searchEngine = (await PgSearchEngine.supported(env.database))
  ? await PgSearchEngine.fromConfig(env.config, { database: env.database })
  : new LunrSearchEngine({ logger: env.logger });
  const indexBuilder = new IndexBuilder({
    logger: env.logger,
    searchEngine,
  });

  const every10MinutesSchedule = env.scheduler.createScheduledTaskRunner({
    frequency: { minutes: 10 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: 3 },
  });

  indexBuilder.addCollator({
    schedule: every10MinutesSchedule,
    factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule: every10MinutesSchedule,
    factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      logger: env.logger,
      tokenManager: env.tokenManager,
    }),
  });

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions: env.permissions,
    config: env.config,
    logger: env.logger,
  });
}
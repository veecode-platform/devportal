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

type ScheduleCustomType = {
  highlightOptions: {
    useHighlight: boolean,
    maxWord: number,
    minWord: number,
    shortWord: number,
    highlightAll: boolean,
    maxFragments: number,
    fragmentDelimiter: string
  },
  schedule: 
  {
     frequency: { minutes: number }, 
     timeout: { minutes: number } 
  } 
}

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

  const scheduleConfig : ScheduleCustomType = env.config.getConfig('search').get('pg') ?? null;
  const frequencyInMinutes = scheduleConfig && (scheduleConfig.schedule.frequency.minutes ? scheduleConfig.schedule.frequency.minutes : 10);
  const timeoutInMinutes = scheduleConfig && (scheduleConfig.schedule.timeout.minutes ? scheduleConfig.schedule.timeout.minutes : 15);
  
  const minutesSchedule = env.scheduler.createScheduledTaskRunner({
    frequency: { minutes: frequencyInMinutes },
    timeout: { minutes: timeoutInMinutes },
    initialDelay: { seconds: 3 },
  });

  indexBuilder.addCollator({
    schedule: minutesSchedule,
    factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule: minutesSchedule,
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
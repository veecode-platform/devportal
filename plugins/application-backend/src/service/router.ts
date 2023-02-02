import {
  PluginDatabaseManager,
  errorHandler,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';



import { ConsumerGroup } from '../modules/kong/model/ConsumerGroup';
import { ConsumerGroupService } from '../modules/kong/services/ConsumerGroupService';

import { createServiceRouter } from './service-route';
import { createPartnersRouter } from './partners-route';
import { createKongRouter } from './kong-extras-route';
import { createApplicationRouter } from './applications-route';
import { applyDatabaseMigrations } from '../../database/migrations';
import { testeRoute } from './teste-router';
import { createPluginRouter } from './plugins-route';
import { createKeycloackRouter } from './keycloak-router';

/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}
export interface Service {
  name: string;
  description?: string;
}


/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;
  await applyDatabaseMigrations(await database.getClient());
  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());

  router.use('/services', await createServiceRouter(options))
  router.use('/partners', await createPartnersRouter(options))
  router.use('/kong-extras', await createKongRouter(options))
  router.use('/applications', await createApplicationRouter(options))
  router.use('/plugins', await createPluginRouter(options))
  router.use('/keycloak', await createKeycloackRouter())
  router.use('/teste', await testeRoute(options))


  

  router.use(errorHandler());
  return router;
}

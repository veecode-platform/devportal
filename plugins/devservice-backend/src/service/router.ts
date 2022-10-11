import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import {  Logger } from 'winston';
import { makeOktaListGroupUserHandler } from '../core/infra/okta/factories/makeOktaListGroupUserHandler';
import { KnexDevServiceRepository } from '../modules/devService/repositories/knex/KnexDevServiceRepository';

/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger , database, config } = options;
  const devServiceRepository = await KnexDevServiceRepository.create(
    await database.getClient(),
  );
  // const knexDB = await database.getClient();
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.post('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/provider-users', async (_, response) => {
      const provider = config.get('auth.providers');
      const list = devServiceRepository.getDevService()
      console.log(list)
      const oktaListGroupUser =makeOktaListGroupUserHandler()
      const partners = await oktaListGroupUser.handle(provider);
      console.log(partners);
      response.send({ status: 'ok' , partners: partners ?  partners: []});
  });
  router.use(errorHandler());
  return router;
}

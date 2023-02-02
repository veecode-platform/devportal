import {
  PluginDatabaseManager,
  errorHandler,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';


import { TestGroups } from '../modules/keycloak/adminClient';
import { ConsumerGroup } from '../modules/kong/model/ConsumerGroup';
import { ConsumerGroupService } from '../modules/kong/services/ConsumerGroupService';
import { KeycloakUserService } from '../modules/keycloak/service/UserService';
import { UpdateUserDto, UserDto } from '../modules/keycloak/dtos/UserDto';

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

  const consumerGroupService = new ConsumerGroupService();


  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());
  router.use('/services', await createServiceRouter(options))
  router.use('/partners', await createPartnersRouter(options))
  router.use('/kong-extras', await createKongRouter(options))
  router.use('/applications', await createApplicationRouter(options))
  router.use('/plugins', await createPluginRouter(options))
  router.use('/keycloack', await createKeycloackRouter())
  router.use('/teste', await testeRoute(options))

  // CONSUMER GROUP

  router.post('/consumer_groups', async (request, response) => {
    try {
      const consumerGroup: ConsumerGroup = request.body;
      const result = await consumerGroupService.createConsumerGroup(
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      console.log(error);
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/consumer_groups', async (_, response) => {
    try {
      const consumerGroups = await consumerGroupService.listConsumerGroups();
      response.status(200).json({ status: 'ok', groups: { consumerGroups } });
    } catch (error: any) {
      response.status(error.status).json({
        message: error.message,
        timestamp: error.timestamp,
      });
    }
  });

  router.post('/consumer_groups', async (request, response) => {
    try {
      const consumerGroup: ConsumerGroup = request.body;
      const result = await consumerGroupService.createConsumerGroup(
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.post('/consumer_groups/:id/consumers', async (request, response) => {
    try {
      const consumerGroup = request.body;
      const result = await consumerGroupService.addConsumerToGroup(
        request.params.id,
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete('/consumer_groups/:id', async (request, response) => {
    try {
      const consumerGroup = await consumerGroupService.deleteConsumerGroup(
        request.params.id,
      );
      response.status(204).json({ status: 'ok', group: { consumerGroup } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete(
    '/consumers/:consumerId/consumer_groups/:groupId',
    async (request, response) => {
      try {
        const consumerGroup =
          await consumerGroupService.removeConsumerFromGroup(
            request.params.consumerId,
            request.params.groupId,
          );
        response.status(204).json({ status: 'ok', group: { consumerGroup } });
      } catch (error: any) {
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );
  router.delete('/consumers/:id/consumer_groups', async (request, response) => {
    try {
      const consumerGroup = await consumerGroupService.removeConsumerFromGroups(
        request.params.id,
      );
      response.status(204).json({ status: 'ok', group: { consumerGroup } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.use(errorHandler());
  return router;
}

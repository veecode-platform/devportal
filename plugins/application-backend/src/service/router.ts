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

  const adminClientKeycloak = new TestGroups();
  const userServiceKeycloak = new KeycloakUserService();
  const consumerGroupService = new ConsumerGroupService();


  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());
  router.use('/services', await createServiceRouter(options))
  router.use('/partners', await createPartnersRouter(options))
  router.use('/kong-extras', await createKongRouter(options))
  router.use('/applications', await createApplicationRouter(options))
  router.use('/plugins', await createPluginRouter(options))
  router.use('/teste', await testeRoute(options))

  // KEYCLOAK
  router.get('/keycloak/groups', async (_, response) => {
    const groups = await adminClientKeycloak.getGroup();
    response.status(200).json({ status: 'ok', groups: groups });
  });

  router.post('/keycloak/users', async (request, response) => {
    const user: UserDto = request.body.user;
    const id = await userServiceKeycloak.createUser(user);
    response.status(201).json({ status: 'ok', id: id });
  });

  router.get('/keycloak/users', async (_, response) => {
    const users = await userServiceKeycloak.listUsers();
    response.status(200).json({ status: 'ok', users: users });
  });

  router.get('/keycloak/users/:id', async (request, response) => {
    const user_id = request.params.id;
    const user = await userServiceKeycloak.findUser(user_id);
    response.status(200).json({ status: 'ok', users: user });
  });

  router.put('/keycloak/users/:id', async (request, response) => {
    const code = request.params.id;
    const user: UpdateUserDto = request.body.user;
    await userServiceKeycloak.updateUser(code, user as UserDto);
    response.status(200).json({ status: 'User Updated!' });
  });

  router.delete('/keycloak/users/:id', async (request, response) => {
    const user_id = request.params.id;
    await userServiceKeycloak.deleteUser(user_id);
    response.status(204).json({ status: 'User Deleted!' });
  });

  router.put(
    '/keycloak/users/:id/groups/:groupId',
    async (request, response) => {
      const user_id = request.params.id;
      const groupId = request.params.groupId;
      const add = await userServiceKeycloak.addUserToGroup(user_id, groupId);
      response.status(200).json({ status: 'User added to group!', add: add });
    },
  );

  router.delete(
    '/keycloak/users/:id/groups/:groupId',
    async (request, response) => {
      const user_id = request.params.id;
      const groupId = request.params.groupId;
      const res = await userServiceKeycloak.removeUserFromGroup(
        user_id,
        groupId,
      );
      response
        .status(204)
        .json({ status: 'User Removed From Group!', res: res });
    },
  );

  router.get('/keycloak/users/:id/groups', async (request, response) => {
    const user_id = request.params.id;
    const groups = await userServiceKeycloak.listUserGroups(user_id);
    response.status(200).json({ status: 'ok', groups: groups });
  });

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

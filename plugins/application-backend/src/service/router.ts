import {
  PluginDatabaseManager,
  errorHandler,
  loadBackendConfig,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

import { PostgresApplicationRepository } from '../modules/applications/repositories/knex/KnexApplicationRepository';

import { TestGroups } from '../modules/keycloak/adminClient';
import { AssociateService } from '../modules/kong-control/AssociateService';
import { KongHandler } from '../modules/kong-control/KongHandler';
import { Consumer } from '../modules/kong-control/model/Consumer';
import { ConsumerGroup } from '../modules/kong/model/ConsumerGroup';
import { AclPlugin } from '../modules/kong/plugins/AclPlugin';
import { KeyAuthPlugin } from '../modules/kong/plugins/KeyAuthPlugin';
import { RateLimitingPlugin } from '../modules/kong/plugins/RateLimitingPlugin';
import { ConsumerGroupService } from '../modules/kong/services/ConsumerGroupService';
import { ConsumerService } from '../modules/kong/services/ConsumerService';
import { PluginService } from '../modules/kong/services/PluginService';
import { UserInvite } from '../modules/okta-control/model/UserInvite';
import { UserService } from '../modules/okta-control/service/UserService';

import { KeycloakUserService } from '../modules/keycloak/service/UserService';
import { UpdateUserDto, UserDto } from '../modules/keycloak/dtos/UserDto';


import { PluginDto } from '../modules/plugins/dtos/PluginDto';
import { PostgresPluginRepository } from '../modules/plugins/repositories/Knex/KnexPluginRepository';
import { ControllPlugin } from '../modules/services/service/ControllPlugin';
import { createServiceRouter } from './service-route';
import { createPartnersRouter } from './partners-route';
import { createKongRouter } from './kong-extras-route';
import { createApplicationRouter } from './applications-route';
import { CredentialsOauth } from '../modules/kong/services/CredentialsOauth';

import { applyDatabaseMigrations } from '../../database/migrations';
import { testeRoute } from './teste-router';

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

  const applicationRepository = await PostgresApplicationRepository.create(
    await database.getClient(),
  );
  const pluginRepository = await PostgresPluginRepository.create(
    await database.getClient(),
  );

  await applyDatabaseMigrations(await database.getClient());

  const config = await loadBackendConfig({ logger, argv: process.argv });
  const adminClientKeycloak = new TestGroups();
  const userServiceKeycloak = new KeycloakUserService();
  const kongHandler = new KongHandler();
  const consumerService = new ConsumerService();
  const credentialsOauth = new CredentialsOauth();
  const controllPlugin = new ControllPlugin();
  const consumerGroupService = new ConsumerGroupService();
  const userService = new UserService();
  const associateService = new AssociateService();
  const pluginService = new PluginService();
  const aclPlugin = AclPlugin.Instance;
  const keyAuthPlugin = KeyAuthPlugin.Instance;
  const rateLimitingPlugin = RateLimitingPlugin.Instance;
  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());
  router.use('/services', await createServiceRouter(options))
  router.use('/partners', await createPartnersRouter(options))
  router.use('/kong-extras', await createKongRouter(options))
  router.use('/applications', await createApplicationRouter(options))
  router.use('/teste', await testeRoute(options))

  // KEYCLOAK
  router.get('/keycloak/groups', async (_, response) => {
    const groups = await adminClientKeycloak.getGroup();
    response.status(200).json({ status: 'ok', groups: groups });
  });

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

  router.post('/credentials-oauth2/:idConsumer', async (request, response) => {
    const id = request.params.idConsumer as string
    const name = request.query.name as string;
    const credential = await credentialsOauth.generateCredentials(id, name)

    response.status(201).json({status: 'ok', response: credential})
  });

  router.get('/credentials-oauth2/:idConsumer', async (request, response) => {
    const id = request.params.idConsumer as string
    const credential = await credentialsOauth.findAllCredentials(id)
    
    response.json({status: 'ok', response: credential})
  });
  router.delete('/credentials-oauth2/:idConsumer', async (request, response) => {
    const id = request.params.idConsumer as string
    const idCredential = request.query.idCredential as string;
    const teste = await credentialsOauth.deleteCredentialById(id, idCredential)
    
    response.status(204).json({status: 'ok', response: teste})
  });

  router.put('/remove-plugin/:idService', async (request, response) => {
    const teste = controllPlugin.removePlugin(
      options,
      request.params.idService as string,
    );
    response.status(404).json(teste);
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
    await userServiceKeycloak.updateUser(code, user);
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

  // PLUGINS
  router.get('/plugins', async (_, response) => {
    const plugins = await pluginRepository.getPlugins();
    response.status(200).json({ status: 'ok', plugins: plugins });
  });

  router.get('/plugin/:id', async (request, response) => {
    const pluginId = request.params.id;
    const plugin = await pluginRepository.getPluginById(pluginId);
    response.status(200).json({ status: 'ok', plugin: plugin });
  });

  router.post('/plugin', async (request, response) => {
    const plugin: PluginDto = request.body.plugin;
    const res = await pluginRepository.createPlugin(plugin);
    response.status(201).json({ status: 'ok', plugin: res });
  });

  router.patch('/plugin/:id', async (request, response) => {
    const pluginId = request.params.id;
    const plugin: PluginDto = request.body.plugin;
    const res = await pluginRepository.patchPlugin(pluginId, plugin);
    response.status(200).json({ status: 'ok', plugin: res });
  });

  router.delete('/plugin/:id', async (request, response) => {
    const pluginId = request.params.id;
    const res = await pluginRepository.deletePlugin(pluginId);
    response.status(204).json({ status: 'ok', plugin: res });
  });

  router.get('/associate/:id', async (request, response) => {
    const services = await associateService.findAllAssociate(
      options,
      request.params.id,
    );
    response.json({ status: 'ok', associates: { services } });
  });
  router.delete('/associate/:id/', async (request, response) => {
    const services = await associateService.removeAssociate(
      options,
      request.params.id,
      request.query.service as string,
    );
    response.json({ status: 'ok', associates: { services } });
  });

  router.post('/user/invite', async (request, response) => {
    let body = request.body.profile;
    let user = new UserInvite(
      body.email,
      body.firstName,
      body.lastName,
      body.login,
      body.mobilePhone,
    );
    try {
      let service = await userService.inviteUserByEmail(
        config.getString('okta.host'),
        config.getString('okta.token'),
        user,
      );
      response.json({ service: service });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorCauses[0].errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.patch('/associate/:id', async (request, response) => {
    const code = request.params.id;
    const listServicesId: string[] = request.body.services;
    await applicationRepository.associate(code, listServicesId);
    response
      .status(200)
      .json({ status: 'ok', application: applicationRepository });
  });



  

  // kong-consumer
  router.get('/consumer/:consumerName', async (request, response) => {
    try {
      const consumer = await consumerService.findConsumer(
        request.params.consumerName,
      );
      response.status(200).json({ status: 'ok', associates: { consumer } });
    } catch (error: any) {
      response.status(error.status).json({
        message: error.message,
        timestamp: error.timestamp,
      });
    }
  });
  router.get('/associate/:id', async (request, response) => {
    const services = await associateService.findAllAssociate(
      options,
      request.params.id,
    );
    response.json({ status: 'ok', associates: { services } });
  });
  router.delete('/associate/:id/', async (request, response) => {
    const services = await associateService.removeAssociate(
      options,
      request.params.id,
      request.query.service as string,
    );
    response.json({ status: 'ok', associates: { services } });
  });

  // router.post('/user/invite', async (request, response) => {
  //   let body = request.body.profile;
  //   let user = new UserInvite(body.email, body.firstName, body.lastName, body.login, body.mobilePhone);
  //   try {
  //     const consumer = await consumerService.findConsumer(
  //       request.params.consumerName,
  //     );
  //     response.status(200).json({ status: 'ok', associates: { consumer } });
  //   } catch (error: any) {
  //     response.status(error.status).json({
  //       message: error.message,
  //       timestamp: error.timestamp,
  //     });
  //   }
  // });

  router.delete('/consumer/:id', async (request, response) => {
    try {
      const consumer = await consumerService.deleteConsumer(request.params.id);
      response.status(204).json({ status: 'ok', associates: { consumer } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  // PLUGINS
 
  router.put('/consumer/:id', async (request, response) => {
    try {
      const consumer: Consumer = request.body;
      const result = await consumerService.updateConsumer(
        request.params.id,
        consumer,
      );
      response.status(200).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });
  router.post('/kong-service/acl/:serviceName', async (request, response) => {
    try {
      const allowed = request.body.allowed;
      const hide = request.body.hide_groups_header;
      const serviceStore = await pluginService.configAclKongService(
        config.getString('kong.api-manager'),
        request.params.serviceName,
        allowed,
        hide,
      );
      if (serviceStore) response.json({ status: 'ok', acl: serviceStore });
      response.json({ status: 'ok', services: [] });
    } catch (error: any) {
      console.log(error);
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });
  router.delete('/kong-service/acl/:serviceName', async (request, response) => {
    try {
      const serviceStore = await aclPlugin.removeAclKongService(
        request.params.serviceName,
        request.query.idAcl as string,
      );
      if (serviceStore) response.json({ status: 'ok', acl: serviceStore });
      response.status(204).json({ status: 'ok', services: [] });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.post(
    '/kong-service/acl-update/:serviceName',
    async (request, response) => {
      try {
        const allowed = request.body.allowed;
        const serviceStore = await aclPlugin.updateAclKongService(
          request.params.serviceName,
          request.query.idAcl as string,
          allowed,
        );
        if (serviceStore) response.json({ status: 'ok', acl: serviceStore });
        response.status(204).json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  // credentials

  router.post('/credencial/:id', async (request, response) => {
    try {
      const id = request.params.id;
      const serviceStore = await kongHandler.generateCredential(
        config.getString('kong.api-manager'),
        id,
      );
      response.status(201).json({ status: 'ok', response: serviceStore });
    } catch (error: any) {
      const date = new Date();
      return response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/credencial/:id', async (request, response) => {
    try {
      const id = request.params.id;
      const serviceStore = await kongHandler.listCredentialWithApplication(
        options,
        config.getString('kong.api-manager'),
        id,
      );
      response.status(200).json({ status: 'ok', credentials: serviceStore });
    } catch (error: any) {
      let date = new Date();
      return response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });
  router.delete('/credencial/:idConsumer', async (request, response) => {
    try {
      const idCredencial = request.query.idCredencial as string;
      const idConsumer = request.params.idConsumer;
      const serviceStore = await kongHandler.removeCredencial(
        config.getString('kong.api-manager'),
        idConsumer,
        idCredencial,
      );
      response.status(204).json({ status: 'ok', credentials: serviceStore });
    } catch (error: any) {
      let date = new Date();
      return response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  // KEY-AUTH - TEST ROUTER
  router.post(
    '/kong-service/plugin/keyauth/:serviceName',
    async (request, response) => {
      try {
        const serviceStore = await keyAuthPlugin.configKeyAuthKongService(
          request.params.serviceName,
          request.body.config.key_names,
        );
        if (serviceStore) {
          response.json({ status: 'ok', plugins: serviceStore });
          return;
        }
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.patch(
    '/kong-service/plugin/keyauth/:serviceName/:pluginId',
    async (request, response) => {
      try {
        const serviceStore = await keyAuthPlugin.updateKeyAuthKongService(
          request.params.serviceName,
          request.params.pluginId,
          request.body.config.key_names,
        );
        if (serviceStore) {
          response.json({ status: 'ok', plugins: serviceStore });
          return;
        }
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.delete(
    '/kong-service/plugin/keyauth/:serviceName/:pluginId',
    async (request, response) => {
      try {
        const serviceStore = await keyAuthPlugin.removeKeyAuthKongService(
          request.params.serviceName,
          request.params.pluginId,
        );
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  // RATE LIMITING - TEST ROUTER
  router.post(
    '/kong-service/plugin/ratelimiting/:serviceName',
    async (request, response) => {
      try {
        const serviceStore =
          await rateLimitingPlugin.configRateLimitingKongService(
            request.params.serviceName,
            request.body.config.rateLimitingType,
            request.body.config.rateLimiting,
          );
        if (serviceStore) {
          response.json({ status: 'ok', plugins: serviceStore });
          return;
        }
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.delete(
    '/kong-service/plugin/ratelimiting/:serviceName/:pluginId',
    async (request, response) => {
      try {
        const serviceStore =
          await rateLimitingPlugin.removeRateLimitingKongService(
            request.params.serviceName,
            request.params.pluginId,
          );
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.patch(
    '/kong-service/plugin/ratelimiting/:serviceName/:pluginId',
    async (request, response) => {
      try {
        const serviceStore =
          await rateLimitingPlugin.updateRateLimitingKongService(
            request.params.serviceName,
            request.params.pluginId,
            request.body.config.rateLimitingType,
            request.body.config.rateLimiting,
          );
        if (serviceStore) {
          response.json({ status: 'ok', plugins: serviceStore });
          return;
        }
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  //consumerGroup
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
  // remove consumer from all
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

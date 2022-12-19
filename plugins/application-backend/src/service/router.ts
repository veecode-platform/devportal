import { InputError } from '@backstage/errors';
import {
  errorHandler,
  loadBackendConfig,
  PluginDatabaseManager,
} from '@backstage/backend-common';
//import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ApplicationDto } from '../modules/applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../modules/applications/repositories/knex/KnexApplicationRepository';
import { KongHandler } from '../modules/kong-control/KongHandler';
import { ConsumerService } from '../modules/kong/services/ConsumerService';
import { UserService } from '../modules/okta-control/service/UserService';
import { UserInvite } from '../modules/okta-control/model/UserInvite';
import { AssociateService } from '../modules/kong-control/AssociateService';
import { PostgresServiceRepository } from '../modules/services/repositories/Knex/KnexServiceReppository';
import { ServiceDto } from '../modules/services/dtos/ServiceDto';
import { PostgresPartnerRepository } from '../modules/partners/repositories/Knex/KnexPartnerReppository';
import { PartnerDto } from '../modules/partners/dtos/PartnerDto';
import { Consumer } from '../modules/kong-control/model/Consumer';

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

export function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error;
  }
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;

  const applicationRepository = await PostgresApplicationRepository.create(
    await database.getClient(),
  );
  const serviceRepository = await PostgresServiceRepository.create(
    await database.getClient(),
  );
  const partnerRepository = await PostgresPartnerRepository.create(
    await database.getClient(),
  );

  const config = await loadBackendConfig({ logger, argv: process.argv });
  const kongHandler = new KongHandler();
  const consumerService = new ConsumerService(config);
  const userService = new UserService();
  const associateService = new AssociateService();
  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());

  // SERVICE
  router.get('/services', async (_, response) => {
    const services = await serviceRepository.getService();
    response.status(200).json({ status: 'ok', services: services });
  });

  router.get('/service/:id', async (request, response) => {
    const code = request.params.id;
    const service = await serviceRepository.getServiceById(code);
    response.status(200).json({ status: 'ok', services: service });
  });

  router.post('/service', async (request, response) => {
    const service: ServiceDto = request.body.service;
    const result = await serviceRepository.createService(service);
    response.status(201).json({ status: 'ok', service: result });
  });

  router.delete('/service/:id', async (request, response) => {
    const code = request.params.id;
    const result = await serviceRepository.deleteService(code);
    response.status(204).json({ status: 'ok', service: result });
  });

  router.post('/service/:id', async (request, response) => {
    const code = request.params.id;
    const service: ServiceDto = request.body.service;

    const result = await serviceRepository.patchService(code, service);
    response.status(200).json({ status: 'ok', service: result });
  });
  // PARTNER
  router.get('/partners', async (_, response) => {
    const partners = await partnerRepository.getPartner();
    response.status(200).json({ status: 'ok', partners: partners });
  });

  router.get('/partner/:id', async (request, response) => {
    const code = request.params.id;
    const partners = await partnerRepository.getPartnerById(code);
    response.status(200).json({ status: 'ok', partners: partners });
  });
  router.get('/partner/applications/:id', async (request, response) => {
    const code = request.params.id;
    const applications = await partnerRepository.findApplications(code);
    response.status(200).json({ status: 'ok', applications: applications })
  });

  router.post('/partner', async (request, response) => {
    const partner: PartnerDto = request.body.partner;
    const result = await partnerRepository.createPartner(partner);
    response.status(201).json({ status: 'ok', partner: result });
  });

  router.delete('/partner/:id', async (request, response) => {
    const code = request.params.id;
    const result = await partnerRepository.deletePartner(code);
    response.status(204).json({ status: 'ok', partner: result });
  });

  router.patch('/partner/:id', async (request, response) => {
    const code = request.params.id;
    const partner: PartnerDto = request.body.partner;
    const result = await partnerRepository.patchPartner(code, partner);
    response.status(200).json({ status: 'ok', partner: result });
  });

  // APPLICATION
  /*router.get('/kong-services', async (_, response) => {
  try{
    const serviceStore = await kongHandler.listServices(config.getString('kong.api-manager'),false);
    if (serviceStore) response.json({ status: 'ok', services: serviceStore });
    response.json({ status: 'ok', services: [] });
  }catch(error: any){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorSummary,
      timestamp: new Date(date).toISOString()
    })
  }
});*/


/*todo erro na rota
router.get('/consumers', async (_, response) => {
  try{
    const serviceStore = await kongHandler.listConsumers(config.getString('kong.api-manager'),false);
    if (serviceStore) response.status(200).json({ status: 'ok', costumer: serviceStore });
    response.status(404).json({ status: 'Not found', services: [] });
  }catch(error: any){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorSummary,
      timestamp: new Date(date).toISOString()
    })
  }
});*/


  router.post('/credencial/:id', async (request, response) => {
    try{
      const workspace = request.query.workspace as string;
      const id = request.params.id;
      const serviceStore = await kongHandler.generateCredential(false, config.getString('kong.api-manager'), workspace as string, id)
      response.status(201).json({ status: 'ok',    response: serviceStore })
    }catch(error: any){
      let date = new Date();
      return response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString()
      })
    }
  });

  router.get('/credencial/:id', async (request, response) => {
    try{
      const workspace = request.query.workspace as string;
      const id = request.params.id;
      const serviceStore = await kongHandler.listCredential(false, config.getString('kong.api-manager'), workspace, id)
      response.status(200).json({ status: 'ok',    credentials: serviceStore })
    }catch(error: any){
      let date = new Date();
      return response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString()
      })
    }
  });






  router.get('/', async (_, response) => {
    try {
      const responseData = await applicationRepository.getApplication();
      return response.json({ status: 'ok', applications: responseData });
    } catch (error: any) {
      let date = new Date();
      return response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

  router.post('/', async (request, response) => {
    const data: ApplicationDto = request.body.application
    try {
      if (!data) {
        throw new InputError(`the request body is missing the application field`);
      }
      logger.info(JSON.stringify(data))
      const result = await applicationRepository.createApplication(data)
      response.send({ status: "ok", result: result });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });


  router.post('/save', async (request, response) => {
    const data: ApplicationDto = request.body.application
    try {

      if (!data) {
        throw new InputError(`the request body is missing the application field`);
      }
      // logger.info(JSON.stringify(data))
      const result = await applicationRepository.createApplication(data)
      response.send({ status: data, result: result });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });


  router.get('/:id', async (request, response) => {
    const code = request.params.id
    try {
      if (!code) {
        throw new InputError(`the request body is missing the application field`);
      }
      const result = await applicationRepository.getApplicationById(code)
      response.send({ status: "ok", application: result });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });


  router.patch('/associate/:id', async (request, response) => {
    const code = request.params.id;
    const listServicesId: string[] = request.body.services;
    await applicationRepository.associate(code, listServicesId);
    response.status(200).json({status: 'ok', application: applicationRepository})
  });


  router.delete('/:id', async (request, response) => {
    const code = request.params.id
    try {
      if (!code) {
        throw new InputError(`the request body is missing the application field`);
      }
      const result = await applicationRepository.deleteApplication(code)
      response.status(204).send({ status: "ok", result: result });

    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

  router.patch('/:id', async (request, response) => {
    const code = request.params.id
    const application: ApplicationDto = request.body.application;
    try {
      if (!code) {
        throw new InputError(`the request body is missing the application field`);
      }
      const result = await applicationRepository.patchApplication(code, application);
      response.send({ status: "ok", result: result });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
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
  //todo
  //router.get('/user/:group/:status', async (request, response) => {
  //  let status = request.params.status.toUpperCase();
  //  try {
  //
  //    let service = await userService.listUserByGroup(config.getString('okta.host'), request.params.group, config.getString('okta.token'), status);
  //    if (service.length > 0) response.json({ status: 'ok', Users: service })
  //    response.status(404).json({ status: 'OK', message: 'Not found' })
  //  } catch (error: any) {
  //    let date = new Date();
  //    response
  //      .status(error.response.status)
  //      .json({
  //        status: 'ERROR',
  //        message: error.response.data.errorSummary,
  //        timestamp: new Date(date).toISOString()
  //      })
  //  }
  //});
  //
  router.get('/user/:query', async (request, response) => {
    try {
      const service = await userService.listUser(
        config.getString('okta.host'),
        config.getString('okta.token'),
        request.params.query,
      );
      if (service.length > 0) return response.json({ users: service });
      return response.status(404).json({ status: 'ok', message: 'Not found' });
    } catch (error: any) {
      let date = new Date();
      return response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  // kong-services
  router.get('/kong-services', async (_, response) => {
    try {
      const serviceStore = await kongHandler.listServices();
      if (serviceStore)
        response.json({ status: 'ok', services: serviceStore ?? [] });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
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

  router.delete('/consumer/:id', async (request, response) => {
    try {
      const consumer = await consumerService.deleteConsumer(request.params.id);
      response.status(204).json({ status: 'ok', associates: { consumer } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
          status: 'ERROR',
          message: error,
          timestamp: new Date(date).toISOString()
        })
    }

  });
  router.get('/kong-services/plugins/:serviceName', async (request, response) => {
    try {
      const serviceStore = await kongHandler.listPluginsService(false, config.getString('kong.api-manager'), request.params.serviceName)
      if (serviceStore) response.json({ status: 'ok', services: serviceStore });
      response.json({ status: 'ok', services: [] });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });
  router.post('/kong-service/plugin/:serviceName', async (request, response) => {
    try {
      const serviceStore = await kongHandler.applyPluginToService(false, config.getString('kong.api-manager'), request.params.serviceName, request.query.pluginName as string);
      if (serviceStore) response.json({ status: 'ok', plugins: serviceStore });
      response.json({ status: 'ok', services: [] });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });
  router.put('/kong-service/plugin/:serviceName', async (request, response) => {
    try {
      const serviceStore = await kongHandler.applyPluginToService(false, config.getString('kong.api-manager'), request.params.serviceName, request.query.pluginName as string);
      if (serviceStore) response.json({ status: 'ok', plugins: serviceStore });
      response.json({ status: 'ok', services: [] });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

  router.delete('/kong-services/plugins/:serviceName', async (request, response) => {
    try {
      const serviceStore = await kongHandler.deletePluginsService(false, config.getString('kong.api-manager'), request.params.serviceName, request.query.pluginName as string)
      if (serviceStore) response.json({ status: 'ok', services: serviceStore });
      response.json({ status: 'ok', services: [] });
    } catch (error: any) {
      let date = new Date();
      response
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

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



  router.use(errorHandler());
  return router;
}

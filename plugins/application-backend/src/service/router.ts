import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import express, { request } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ApplicationDto } from '../modules/applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../modules/applications/repositories/knex/KnexApplicationRepository';
import { KongHandler } from '../modules/kong-control/KongHandler';
import { OktaHandler } from '../modules/okta-control/oktaHandler';

/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}
export interface Service{
name: string;
description?: string;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database} = options;

  const applicationRepository = await PostgresApplicationRepository.create(
    await database.getClient(),
  );

  const kongHandler = new KongHandler();
  const oktaHandler = new OktaHandler();

  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());



  router.get('/usersbygroup/:group/:status', async (request, response) => {
    let status = request.params.status.toUpperCase();
    const service = await oktaHandler.listUserByGroup('dev-44479866-admin.okta.com', request.params.group, `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, status);
    console.log(status)
    response.json({status: 'ok', Users: service})
  });

  router.get('/users/:query', async (request, response) => {
    const service = await oktaHandler.listUser('dev-44479866-admin.okta.com', `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, request.params.query)
    response.json({status: 'ok', Users: service})
    
  })
  

  router.get('/kong-services', async (_, response) => {
   const serviceStore = await kongHandler.listServices("api.manager.localhost:8000",false);
   if (serviceStore) response.json({ status: 'ok', services: serviceStore });
   response.json({ status: 'ok', services: [] });
  });

  router.get('/', async (_, response) => {
    const responseData = await applicationRepository.getApplication();
    return response.json({ status: 'ok', applications: responseData });
  });

  router.post('/create-application', async (request, response) => {
    const data: ApplicationDto = request.body.application
    if (!data) {
      throw new InputError(`the request body is missing the application field`);
    }
    logger.info(JSON.stringify(data))
    const result = await applicationRepository.createApplication(data)
    response.send({ status: "ok",result:result });
  });

  router.post('/save', async (request, response) => {
    const data: ApplicationDto = request.body.application
    if (!data) {
      throw new InputError(`the request body is missing the application field`);
    }
    // logger.info(JSON.stringify(data))
    const result = await applicationRepository.createApplication(data)
    response.send({ status: data,result:result });
  });

  router.get('/get-application/:id', async (request, response) => {
    const code = request.params.id
    if (!code) {
      throw new InputError(`the request body is missing the application field`);
    }
    const result = await applicationRepository.getApplicationById(code)
    response.send({ status: "ok",application:result });
  });

  router.delete('/delete-application/:id', async (request, response) => {
    const code = request.params.id
    if (!code) {
      throw new InputError(`the request body is missing the application field`);
    }
    const result = await applicationRepository.deleteApplication(code)  
    response.send({ status: "ok",result:result });
  } );

  router.put('/update-application/:id', async (request, response) => {
    const code = request.params.id
    if (!code) {
      throw new InputError(`the request body is missing the application field`);
    }
    // const result = await applicationRepository.updateApplication(code);
    response.send({ status: "ok",result:"result" });
  } );

  router.use(errorHandler());
  return router;
}

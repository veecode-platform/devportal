import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import express, { request } from 'express';
import Router from 'express-promise-router';
import { Logger, profile } from 'winston';
import { Config } from '@backstage/config';
import { ApplicationDto } from '../modules/applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../modules/applications/repositories/knex/KnexApplicationRepository';
import { KongHandler } from '../modules/kong-control/KongHandler';
import { OktaHandler } from '../modules/okta-control/oktaHandler';
import { AxiosError } from 'axios';
import { Profile, User } from '../modules/applications/dtos/User';

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


  router.post('/invite/user', async (request, response) => {
  let body = request.body.profile;
  let user = new User(body.email, body.firstName, body.lastName, body.login);
  let service = oktaHandler.inviteUserByEmail('dev-44479866-admin.okta.com', `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, user);
  response.json({service: service})
  });

  router.get('/usersbygroup/:group/:status', async (request, response) => {
    let status = request.params.status.toUpperCase();
    try{

      let service = await oktaHandler.listUserByGroup('dev-44479866-admin.okta.com', request.params.group, `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, status);
      if(service.length > 0) response.json({status: 'ok', Users: service})
        response.status(404).json({status: 'OK', message: 'Not found'})
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString
      })
    }});

  router.get('/users/:query', async (request, response) => {
    try{
      const service = await oktaHandler.listUser('dev-44479866-admin.okta.com', `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, request.params.query)
      if(service.length > 0)response.json({users: service})
         response.status(404).json({status: 'ok', message: 'Not found'})
    }catch(error){
    let date = new Date();
    return response
      .status( error.response.status  )
      .json({
      status: 'ERROR',
      message: error.response.data.errorSummary, 
      timestamp: new Date(date).toISOString()
    });
  }})
  

  router.get('/kong-services', async (_, response) => {
  try{
    const serviceStore = await kongHandler.listServices("api.manager.localhost:8000",false);
    if (serviceStore) response.json({ status: 'ok', services: serviceStore });
    response.json({ status: 'ok', services: [] });
  }catch(error){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorSummary,
      timestamp: new Date(date)
    })
  }

});

  router.get('/', async (_, response) => {
    try{
      const responseData = await applicationRepository.getApplication();
      return response.json({ status: 'ok', applications: responseData });
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date)
      })
    }
  });

  router.post('/create-application', async (request, response) => {
    const data: ApplicationDto = request.body.application
    try{
      if (!data) {
        throw new InputError(`the request body is missing the application field`);
      }
      logger.info(JSON.stringify(data))
      const result = await applicationRepository.createApplication(data)
      response.send({ status: "ok",result:result });
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date)
      })
    }
  });


  router.post('/save', async (request, response) => {
    const data: ApplicationDto = request.body.application
    try{
      
      if (!data) {
        throw new InputError(`the request body is missing the application field`);
      }
      // logger.info(JSON.stringify(data))
      const result = await applicationRepository.createApplication(data)
      response.send({ status: data,result:result });
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString
      })
    }});


  router.get('/get-application/:id', async (request, response) => {
    const code = request.params.id
    try{
      if (!code) {
        throw new InputError(`the request body is missing the application field`);
      }
      const result = await applicationRepository.getApplicationById(code)
      response.send({ status: "ok",application:result });
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString
      })
    }});


  router.delete('/delete-application/:id', async (request, response) => {
    const code = request.params.id
   try{
     if (!code) {
       throw new InputError(`the request body is missing the application field`);
     }
     const result = await applicationRepository.deleteApplication(code)  
     response.send({ status: "ok",result:result });

   }catch(error){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorSummary,
      timestamp: new Date(date).toISOString
    })
  }});
   
  router.put('/update-application/:id', async (request, response) => {
    const code = request.params.id
    try{
      if (!code) {
        throw new InputError(`the request body is missing the application field`);
      }
      // const result = await applicationRepository.updateApplication(code);
      response.send({ status: "ok",result:"result" });
    }catch(error){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString
      })
    }});

  router.use(errorHandler());
  return router;
}

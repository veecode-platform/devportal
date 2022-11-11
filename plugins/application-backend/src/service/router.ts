import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { Logger} from 'winston';
import { Config } from '@backstage/config';
import { ApplicationDto } from '../modules/applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../modules/applications/repositories/knex/KnexApplicationRepository';
import { KongHandler } from '../modules/kong-control/KongHandler';



import { UserService } from '../modules/okta-control/service/UserService';
import { UserInvite } from '../modules/okta-control/model/UserInvite';
import { AssociateService } from '../modules/kong-control/AssociateService';



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

export function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
      throw error
  }
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
  const userService = new UserService();
  const associateService = new AssociateService()
  logger.info('Initializing application backend');

  const router = Router();
  router.use(express.json());

                  //  /user



  router.patch('/associate/:id', async (request, response) => {
    await associateService.associate(options, request.params.id, request.body.consumerName);
    response.json({status: 'ok'})
  }  );              

  router.post('/user/invite', async (request, response) => {
  let body = request.body.profile;
  let user = new UserInvite(body.email, body.firstName, body.lastName, body.login, body.mobilePhone);
  try{
    let service = await userService.inviteUserByEmail('dev-44479866-admin.okta.com', `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, user);
    response.json({service: service})
  }catch(error: any){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorCauses[0].errorSummary,
      timestamp: new Date(date).toISOString()
    })
  }});

  router.get('/user/:group/:status', async (request, response) => {
    let status = request.params.status.toUpperCase();
    try{

      let service = await userService.listUserByGroup('dev-44479866-admin.okta.com', request.params.group, `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, status);
      if(service.length > 0) response.json({status: 'ok', Users: service})
        response.status(404).json({status: 'OK', message: 'Not found'})
    }catch(error: any){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message:    error.response.data.errorSummary,
        timestamp: new Date(date).toISOString()
      })
    }});

  router.get('/user/:query', async (request, response) => {
    try{
      const service = await userService.listUser('dev-44479866-admin.okta.com', `00FHyibLyC5PuT31zelP_JpDo-lpclVcK0o44cULpd`, request.params.query)
      if(service.length > 0)response.json({users: service})
         response.status(404).json({status: 'ok', message: 'Not found'})
    }catch(error: any){
    let date = new Date();
    return response
      .status( error.response.status  )
      .json({
      status: 'ERROR',
      message: error.response.data.errorSummary, 
      timestamp: new Date(date).toISOString()
    });
  }})
  

  // /kong-services

  router.get('/kong-services', async (_, response) => {
  try{
    const serviceStore = await kongHandler.listServices("api.manager.localhost:8000",false);
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

});

  router.get('/', async (_, response) => {
    try{
      const responseData = await applicationRepository.getApplication();
      return response.json({ status: 'ok', applications: responseData });
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
    }catch(error: any){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString()
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
    }catch(error: any){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString()
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

   }catch(error: any){
    let date = new Date();
    response
    .status(error.response.status)
    .json({
      status: 'ERROR',
      message: error.response.data.errorSummary,
      timestamp: new Date(date).toISOString()
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
    }catch(error: any){
      let date = new Date();
      response
      .status(error.response.status)
      .json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString()
      })
    }});

  router.use(errorHandler());
  return router;
}

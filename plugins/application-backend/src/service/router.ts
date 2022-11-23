import { errorHandler, loadBackendConfig, PluginDatabaseManager } from '@backstage/backend-common';
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
  const config = await loadBackendConfig({ logger, argv: process.argv });
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
  
  router.get('/associate/:id', async (request, response) => {
    const services = await associateService.findAllAssociate(options, request.params.id);
    response.json({status: 'ok', associates: {services}})
  }  ); 

  // 
  router.delete('/associate/:id/', async (request, response) => {
    const services = await associateService.removeAssociate(options, request.params.id, request.query.service as string);
    response.json({status: 'ok', associates: {services}})
  }  ); 

  router.post('/user/invite', async (request, response) => {
  let body = request.body.profile;
  let user = new UserInvite(body.email, body.firstName, body.lastName, body.login, body.mobilePhone);
  try{
    let service = await userService.inviteUserByEmail(config.getString('okta.host'), config.getString('okta.token'), user);
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

      let service = await userService.listUserByGroup(config.getString('okta.host'), request.params.group, config.getString('okta.token'), status);
      if(service.length > 0) response.json({status: 'ok', Users: service})
        response.status(404).json({status: 'OK', message: 'Not found'})
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

  router.get('/user/:query', async (request, response) => {
    try{
      const service = await userService.listUser(config.getString('okta.host'), config.getString('okta.token'), request.params.query)
      if(service.length > 0) return response.json({users: service})
      return response.status(404).json({status: 'ok', message: 'Not found'})
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
});


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
});


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
      const serviceStore = await kongHandler.listCredential(false, config.getString('kong.api-manager'), workspace as string, id)
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
    try{
      const responseData = await applicationRepository.getApplication();
      return response.json({ status: 'ok', applications: responseData });
    }catch(error: any){
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


  router.get('/:id', async (request, response) => {
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


  router.delete('/:id', async (request, response) => {
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
   
  router.put('/:id', async (request, response) => {
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

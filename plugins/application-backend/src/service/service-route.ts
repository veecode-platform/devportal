import { Router } from 'express';
import express from 'express';
import { ControllPlugin } from '../modules/services/service/ControllPlugin';
import { PostgresServiceRepository } from '../modules/services/repositories/Knex/KnexServiceReppository';
import { RouterOptions } from './router';
import { ServiceDto } from '../modules/services/dtos/ServiceDto';
import { AxiosError } from 'axios';
// import { AuthorizeResult } from '@backstage/plugin-permission-common';
// import { adminAccessPermission } from '@internal/plugin-application-common';// nome da permissao criada anteriormente no plugin-common
// import { NotAllowedError } from '@backstage/errors';
// import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { PostgresApplicationServiceRepository } from '../modules/applications/repositories/knex/KnexApplicationServiceRepository';
import { PostgresPartnerServiceRepository } from '../modules/partners/repositories/Knex/knexPartnerServiceRepository';
import { PostgresPluginRepository } from '../modules/plugins/repositories/Knex/KnexPluginRepository';
import { Service } from '../modules/services/domain/Service';

/** @public */
export async function createServiceRouter(
  options: RouterOptions,
): Promise<Router> {
  // const { permissions } = options;

  const serviceRepository = await PostgresServiceRepository.create(
    await options.database.getClient(),
  );

  const applicationServiceRepository = await PostgresApplicationServiceRepository.create(await options.database.getClient())
  const partnerServiceRepository = await PostgresPartnerServiceRepository.create(await options.database.getClient())
  const pluginRepository = await PostgresPluginRepository.create(await options.database.getClient())

  const controllPlugin = new ControllPlugin();

  const serviceRouter = Router();
  serviceRouter.use(express.json());

  serviceRouter.get('/', async (request, response) => {
    /* const token = getBearerTokenFromAuthorizationHeader(request.header('authorization'));
    const decision = (await permissions.authorize([{ permission: adminAccessPermission }], {token: token}))[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }*/
    const limit: number = request.query.limit as any;
    const offset: number = request.query.offset as any;
    const services = await serviceRepository.getService(limit, offset);
    const total = await serviceRepository.total()
    response.status(200).json({ status: 'ok', services: services, total: total });
  });


  serviceRouter.get('/:id', async (request, response) => {
    const code = request.params.id;
    const service = await serviceRepository.getServiceById(code);
    response.status(200).json({ status: 'ok', service: service });
  });

  serviceRouter.get('/:id/partners', async (request, response) => {
    const serviceId = request.params.id;
    const partners = await partnerServiceRepository.getPartnerByservice(serviceId)
    response.status(200).json({ status: 'ok', partners: partners });
  });

  serviceRouter.post('/', async (request, response) => {
    try {
      const service: ServiceDto = request.body.service;
      let plugins: Array<any> = []
      if(!options.config.getBoolean("kong.readOnlyMode")) {
        plugins = await controllPlugin.applySecurityType(service) as any;
      }
          
      const result = await serviceRepository.createService(service) as Service;
      if(plugins.length !== 0){
        plugins.forEach((p)=>{
          pluginRepository.createPlugin({
            name: p.name,
            kongPluginId: p.id,
            service: result._id as string
          })
        })
      }
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      if (error instanceof Error) {
        response.status(500).json({
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      } else if (error instanceof AxiosError) {
        error = AxiosError
        const date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });

  serviceRouter.patch('/:id', async (request, response) => {
    try {
      const serviceId = request.params.id
      const service = request.body.service;

      if(service.partnersId !== undefined){
        const partners = service.partnersId
        await partnerServiceRepository.deleteService(serviceId)
        await partnerServiceRepository.associatePartnersToService(partners, serviceId)
        response.status(201).json({ status: 'ok', service: partners });
      }
      else{
      if(service.rateLimiting !== undefined){
        await controllPlugin.updateServicePlugins(serviceId, "rateLimiting", options, service.rateLimiting)
      } 
      if(service.securityType !== undefined){
        await controllPlugin.updateServicePlugins(serviceId, service.securityType ,options)
      }
      delete service.rateLimiting
      delete service.securityType
      await serviceRepository.patchService(serviceId, service)
      response.status(201).json({ status: 'ok', service: service });
      }

    } catch (error: any) {
      if (error instanceof Error) {
        response.status(500).json({
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      } else if (error instanceof AxiosError) {
        error = AxiosError
        const date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });
  
  serviceRouter.delete('/:id', async (request, response) => {
    const serviceId = request.params.id;
    await controllPlugin.deleteService(serviceId, options)
    await applicationServiceRepository.deleteService(serviceId)
    await partnerServiceRepository.deleteService(serviceId)

    const result = await serviceRepository.deleteService(serviceId);
    response.status(204).json({ status: 'ok', service: result });
  });

  return serviceRouter;

}





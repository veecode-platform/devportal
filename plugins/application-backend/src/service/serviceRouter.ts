import { Router } from 'express';
import express from 'express';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { ControllPlugin } from '../modules/services/service/ControllPlugin';
import { PostgresServiceRepository } from '../modules/services/repositories/Knex/KnexServiceReppository';
import { RouterOptions } from './router';
import { ServiceDto } from '../modules/services/dtos/ServiceDto';





/** @public */
export async function createServiceRouter(
  options: RouterOptions,
): Promise<Router> {

  const serviceRepository = await PostgresServiceRepository.create(
    await options.database.getClient(),
  );
  const controllPlugin = new ControllPlugin();
  const serviceRouter = Router();

  serviceRouter.use(express.json());
  serviceRouter.get('/', async (request, response) => {
    const limit: number = request.query.limit as any;
    const offset: number = request.query.offset as any;
    const services = await serviceRepository.getService(limit, offset);
    response.status(200).json({ status: 'ok', services: services });
  });


  serviceRouter.get('/:id', async (request, response) => {
    const code = request.params.id;
    const service = await serviceRepository.getServiceById(code);
    response.status(200).json({ status: 'ok', services: service });
  });

  serviceRouter.post('/', async (request, response) => {
    try {
      const service: ServiceDto = request.body.service;
      controllPlugin.applySecurityType(service);
      const result = await serviceRepository.createService(service);
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

  serviceRouter.delete('/:id', async (request, response) => {
    const code = request.params.id;
    const result = await serviceRepository.deleteService(code);
    response.status(204).json({ status: 'ok', service: result });
  });

  return serviceRouter;

}





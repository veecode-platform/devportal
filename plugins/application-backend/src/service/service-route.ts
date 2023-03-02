import { Router } from 'express';
import express from 'express';
import { ControllPlugin } from '../modules/services/service/ControllPlugin';
import { PostgresServiceRepository } from '../modules/services/repositories/Knex/KnexServiceReppository';
import { RouterOptions } from './router';
import { ServiceDto } from '../modules/services/dtos/ServiceDto';
import { AxiosError } from 'axios';
import { PostgresServicePartnerRepository } from '../modules/services/repositories/Knex/KnexServicePartnerRepossitory';





/** @public */
export async function createServiceRouter(
  options: RouterOptions,
): Promise<Router> {

  const serviceRepository = await PostgresServiceRepository.create(
    await options.database.getClient(),
  );

  const servicePartnerRepository = await PostgresServicePartnerRepository.create(
    await options.database.getClient(),
  )
  const controllPlugin = new ControllPlugin();
  const serviceRouter = Router();
  serviceRouter.use(express.json());

  serviceRouter.get('/', async (request, response) => {
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

  serviceRouter.get('/partners/:idService', async (request, response) => {
    const code = request.params.idService;
    const partners = await servicePartnerRepository.getPartnersByService(code);
    response.status(200).json({ status: 'ok', partners: partners });
  });

  serviceRouter.post('/', async (request, response) => {
    try {
      const service: ServiceDto = request.body.service;
      controllPlugin.applySecurityType(service);
      const result = await serviceRepository.createService(service);
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
        let date = new Date();
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
      const service: ServiceDto = request.body.service;
      const id = request.params.id
      const result = await serviceRepository.patchService(id, service);
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
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });
  serviceRouter.put('/:id', async (request, response) => {
    try {
      const service: ServiceDto = request.body.service;
      const id = request.params.id
      const result = await serviceRepository.updateService(id, service);
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
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });

  serviceRouter.delete('/:id', async (request, response) => {
    const code = request.params.id;
    const result = await serviceRepository.deleteService(code);
    response.status(204).json({ status: 'ok', service: result });
  });

  


  return serviceRouter;

}





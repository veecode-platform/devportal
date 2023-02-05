import { Router } from "express";
import express from 'express';

import { RouterOptions } from "./router";
import { PostgresApplicationRepository } from "../modules/applications/repositories/knex/KnexApplicationRepository";
import { InputError } from "@backstage/errors";
import { ApplicationDto } from "../modules/applications/dtos/ApplicationDto";
import { ApplicationServices } from "../modules/applications/services/ApplicationServices";
import { AssociateService } from "../modules/kong-control/AssociateService";
import { KongHandler, security } from "../modules/kong-control/KongHandler";
import { KongServiceBase } from "../modules/kong/services/KongServiceBase";

/** @public */
export async function createApplicationRouter(
  options: RouterOptions,
): Promise<Router> {

  const applicationRepository = await PostgresApplicationRepository.create(
    await options.database.getClient(),
  );

  const router = Router()
  const kongHandler = new KongHandler()
  const kongServiceBase = new KongServiceBase()
  const associateService = new AssociateService();
  router.use(express.json())

  //revisar rotas pt-br para en
  router.get('/', async (request, response) => {
    try {
      const limit: number = request.query.limit as any;
      const offset: number = request.query.offset as any;
      const responseData = await applicationRepository.getApplication(
        limit,
        offset,
      );
      const total = await applicationRepository.total();
      return response.json({ status: 'ok', applications: responseData, total: total });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      let date = new Date();
      return response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.post('/', async (request, response) => {
    const data = request.body;
    await ApplicationServices.Instance.createApplication(data, options);
    try {
      if (!data) {
        throw new InputError(
          `the request body is missing the application field`,
        );
      }

      const result = await applicationRepository.createApplication(data);
      response.send({ status: 'ok', result: result });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.post('/save', async (request, response) => {
    const data: ApplicationDto = request.body.application;
    try {
      if (!data) {
        throw new InputError(
          `the request body is missing the application field`,
        );
      }
      // logger.info(JSON.stringify(data))
      const result = await applicationRepository.createApplication(data);
      response.send({ status: data, result: result });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });
  router.patch('/:id', async (request, response) => {
    const data: ApplicationDto = request.body;
    const applicationId = request.params.id
    await ApplicationServices.Instance.updateApplication(applicationId, data, options);
    try {
      if (!data) {
        throw new InputError(
          `the request body is missing the application field`,
        );
      }
      // logger.info(JSON.stringify(data))
      const result = await applicationRepository.patchApplication(applicationId, data);
      response.send({ status: 'OK', result: result });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      console.log(error)
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.put('/:id', async (request, response) => {
    const data: ApplicationDto = request.body.applications;
    const code = request.params.id
    try {
      if (!data) {
        throw new InputError(
          `the request body is missing the application field`,
        );
      }
      // logger.info(JSON.stringify(data))
      const result = await applicationRepository.updateApplication(code, data);
      response.send({ status: 'OK', result: result });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      console.log(error)
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/:id', async (request, response) => {
    const code = request.params.id;
    try {
      if (!code) {
        throw new InputError(
          `the request body is missing the application field`,
        );
      }
      const result = await applicationRepository.getApplicationById(code);
      response.send({ status: 'ok', application: result });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete('/:id', async (request, response) => {
    const id = request.params.id;
    await ApplicationServices.Instance.removeApplication(id, options);
    const result = await applicationRepository.deleteApplication(id);
    response.status(204).json({ status: 'ok', applications: result })
  });

  // associate applications with servicesId
  router.patch('/associate/:id', async (request, response) => {
    const id = request.params.id;
    const listServicesId: string[] = request.body.services;
    await applicationRepository.associate(id, listServicesId);
    response
      .status(200)
      .json({ status: 'ok', application: applicationRepository });
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

  // CREDENTIALS 

  router.post('/:idApplication/credentials', async (req, res) => {
    try {
      const id = req.params.idApplication;
      const type = req.body.type as security
      const serviceStore = await kongHandler.generateCredential(
        options,
        await kongServiceBase.getUrl(),
        id,
        type
      );
      res.status(201).json({ status: 'ok', response: serviceStore });
    } catch (error: any) {
      if (error == undefined) {
        res.status(500).json({ status: 'error' })
      }
      let date = new Date();
      return res.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/:idApplication/credentials', async (req, res) => {
    try {
      const id = req.params.idApplication;
      const serviceStore = await kongHandler.listCredentialWithApplication(
        options,
        await kongServiceBase.getUrl(),
        id
      );
      res.status(200).json({ status: 'ok', credentials: serviceStore });
    } catch (error: any) {
      if (error == undefined) {
        res.status(500).json({ status: 'error' })
      }
      let date = new Date();
      return res.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });


  router.delete('/:idApplication/credentials', async (request, response) => {
    try {
      const idCredential = request.query.idCredential as string;
      const idApplication = request.params.idApplication;
      const serviceStore = await kongHandler.removeCredencial(
        options,
        await kongServiceBase.getUrl(),
        idApplication,
        idCredential,
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
  return router;


}
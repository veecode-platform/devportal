import { Router } from "express";
import express from 'express';

import { RouterOptions } from "./router";
import { PostgresApplicationRepository } from "../modules/applications/repositories/knex/KnexApplicationRepository";
import { InputError } from "@backstage/errors";
import { ApplicationDto } from "../modules/applications/dtos/ApplicationDto";
import { ApplicationServices } from "../modules/applications/services/ApplicationServices";

/** @public */
export async function createApplicationRouter(
    options: RouterOptions,
  ): Promise<Router> {
  
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );

    const router = Router()
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
          let date = new Date();
          return response.status(error.response.status).json({
            status: 'ERROR',
            message: error.response.data.errorSummary,
            timestamp: new Date(date).toISOString(),
          });
        }
      });
    
      router.post('/', async (request, response) => {
        const data = request.body.applications;
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
          let date = new Date();
          response.status(error.response.status).json({
            status: 'ERROR',
            message: error.response.data.errorSummary,
            timestamp: new Date(date).toISOString(),
          });
        }
      });
      router.patch('/:id', async (request, response) => {
        const data: ApplicationDto = request.body.applications;
        const applicationId = request.params.id
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
          console.log(error)
          let date = new Date();
          response.status(error.response.status).json({
            status: 'ERROR',
            message: error.response.data.errorSummary,
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
          let date = new Date();
          response.status(error.response.status).json({
            status: 'ERROR',
            message: error.response.data.errorSummary,
            timestamp: new Date(date).toISOString(),
          });
        }
      });

      router.delete('/:id', async (request, response) =>{
        const id = request.params.id;
        const result = await applicationRepository.deleteApplication(id);
        response.status(204).json({status: 'ok', applications: result})
      });

    return router;

  }
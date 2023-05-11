import { Router } from "express";
import express from 'express';
import { RouterOptions } from "./router";
import { PostgresApplicationRepository } from "../modules/applications/repositories/knex/KnexApplicationRepository";
import { Application } from "../modules/applications/domain/Application";
import { ApplicationDto } from "../modules/applications/dtos/ApplicationDto";
import { ApplicationServices } from "../modules/applications/services/ApplicationServices";
// import { AssociateService } from "../modules/kong-control/AssociateService";
import { KongHandler, security } from "../modules/kong-control/KongHandler";
import { AxiosError } from "axios";
import { PostgresApplicationServiceRepository } from "../modules/applications/repositories/knex/KnexApplicationServiceRepository";
// import { PostgresApplicationPartnerRepository } from "../modules/applications/repositories/knex/KnexApplicationPartnerRepository";
import { PostgresPartnerRepository } from "../modules/partners/repositories/Knex/KnexPartnerRepository";

/** @public */
export async function createApplicationRouter(
  options: RouterOptions,
): Promise<Router> {

  const {identity} = options

  const applicationRepository = await PostgresApplicationRepository.create(
    await options.database.getClient(),
  );
  const applicationServiceRepository = await PostgresApplicationServiceRepository.create(
    await options.database.getClient(),
  )
  const partnerRepository = await PostgresPartnerRepository.create(await options.database.getClient())
  // const applicationPartnerRepository = await PostgresApplicationPartnerRepository.create(await options.database.getClient())

  const router = Router()
  const kongHandler = new KongHandler()
  // const associateService = new AssociateService();
  router.use(express.json())

  router.get('/', async (request, response) => {
    try {
      const user = await identity.getIdentity({ request: request });
      const isAdmin = user?.identity.userEntityRef.split(':')[0] === "admin" ? true : false
      const creator = user?.identity.userEntityRef.split("/")[1] as string
      const limit: number = request.query.limit as any;
      const offset: number = request.query.offset as any;
      const responseData =  isAdmin ? await applicationRepository.getApplication(limit, offset) : await applicationRepository.getApplicationByCreator(creator, 10, 0)
      const total = await applicationRepository.total();
      response.json({ status: 'ok', applications: responseData, total: total });
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

  router.get('/partners/:id', async (request, response) => {// get applications by creator
    try {
      const creator = request.params.id
      const limit: number = request.query.limit as any;
      const offset: number = request.query.offset as any;
      const responseData =  await applicationRepository.getApplicationByCreator(creator, limit, offset)
      const total = await applicationRepository.total();
      response.json({ status: 'ok', applications: responseData, total: total });
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



  router.post('/', async (request, response) => {
    const data = request.body.application;
    try {
      const partner = await partnerRepository.getPartnerIdByUserName(data.creator) as any
      await ApplicationServices.Instance.createApplication(data,partner.id, options);
      const result = await applicationRepository.createApplication(data, partner.id) as Application;
      await applicationServiceRepository.associate(result._id as string, data.services)
      
      response.send({ status: 'ok', result: result});
    } 
    catch (error: any) {
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

  router.patch('/:id', async (request, response) => {
    try {
      const data: ApplicationDto = request.body.application;
      const applicationId = request.params.id;
      const partner = await partnerRepository.getPartnerIdByUserName(data.creator) as any
      const result = await applicationRepository.patchApplication(applicationId, data, partner);
      if(data.services.length === 0) {
        response.send({ status: 'OK', result: result}) 
      }   
      const associated = await ApplicationServices.Instance.updateApplication(applicationId, data, options);
      response.send({ status: 'OK', result: result, associated: associated});

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

  router.get('/:id', async (request, response) => {
    const code = request.params.id;
    try {
      const result = await applicationRepository.getApplicationById(code);
      response.send({ status: 'ok', application: result });
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

  router.delete('/:id', async (request, response) => {      
    try {
      const id = request.params.id;
      await ApplicationServices.Instance.removeApplication(id, options);
      const removeAssociation = await applicationServiceRepository.deleteApplication(id)
      const result = await applicationRepository.deleteApplication(id);
      response.status(204).json({ status: 'ok', applications: result, removed: removeAssociation })
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


  // associate applications with servicesId


  router.get('/:id/services', async (request, response) => {
    try {
      const idApplication = request.params.id;
      const services = await applicationServiceRepository.getServicesByApplication(idApplication)
      const promises = await Promise.all(services.map(async (service: any) => {
        const route = await kongHandler.listRoutesFromService(service.kongServiceId)
        return {
          ...service,
          route: route
        }
      }))

      response.status(200).json({ services: promises })
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



  router.post('/services/:idApplication', async (request, response) => {
    try {
      const idApplication = request.params.idApplication;
      const servicesId = request.body.servicesId as string[];
      const services = await applicationServiceRepository.associate(idApplication, servicesId)
      response.status(200).json({ services: services })
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


  router.patch('/associate/:id', async (request, response) => {
    try {
      const id = request.params.id;
      const listServicesId: string[] = request.body.services;
      await applicationServiceRepository.associate(id, listServicesId);
      response
        .status(200)
        .json({ status: 'ok', application: applicationRepository });
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


  /* router.get('/associate/:id', async (request, response) => { refactor
    try {
      const services = await associateService.findAllAssociate(
        options,
        request.params.id,
      );
      response.json({ status: 'ok', associates: { services } });
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
  });*/
  /* router.delete('/associate/:id/', async (request, response) => { refactor
    try {
      const services = await associateService.removeAssociate(
        options,
        request.params.id,
        request.query.service as string,
      );
      response.json({ status: 'ok', associates: { services } });
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
  });*/

  // CREDENTIALS 

  router.post('/:idApplication/credentials', async (req, res) => {
    try {
      const id = req.params.idApplication;
      const type = req.body.type as security
      const serviceStore = await kongHandler.generateCredential(
        options,
        id,
        type
      );
      res.status(201).json({ status: 'ok', response: serviceStore });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      } else if (error instanceof AxiosError) {
        error = AxiosError
        const date = new Date();
        res.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });

  router.get('/:idApplication/credentials', async (req, res) => { 

    try {
      const id = req.params.idApplication;
      const serviceStore = await kongHandler.listCredentialWithApplication(
        options,
        id
      );
      res.status(200).json({ status: 'ok', credentials: serviceStore });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      } else if (error instanceof AxiosError) {
        error = AxiosError
        const date = new Date();
        res.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    }
  });


  router.delete('/:idApplication/credentials', async (request, response) => {
    try {
      const idCredential = request.query.idCredential as string;
      const type = request.query.type as security;

      const idApplication = request.params.idApplication;
      const serviceStore = await kongHandler.removeCredencial(
        options,
        idApplication,
        idCredential,
        type
      );
      response.status(204).json({ status: 'ok', credentials: serviceStore });
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
  return router;
}
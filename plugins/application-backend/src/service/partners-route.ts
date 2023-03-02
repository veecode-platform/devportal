import { Router } from "express";
import { RouterOptions } from "./router";
import { PostgresPartnerRepository } from "../modules/partners/repositories/Knex/KnexPartnerRepository";
import { PartnerDto } from "../modules/partners/dtos/PartnerDto";
import { AxiosError } from "axios";
import { PostgresPartnerApplicationRepository } from "../modules/partners/repositories/Knex/KnexPartnerApplicationRepository";
import { PostgresPartnerServiceRepository } from "../modules/partners/repositories/Knex/knexPartnerServiceRepository";

/** @public */
export async function createPartnersRouter(
  options: RouterOptions,
): Promise<Router> {
  const partnerRepository = await PostgresPartnerRepository.create(
    await options.database.getClient(),
  );


  const partnerApplicationRepository = await PostgresPartnerApplicationRepository.create(
    await options.database.getClient(),
  )

  const partnerServiceRepository = await PostgresPartnerServiceRepository.create(
    await options.database.getClient(),
  )
  const router = Router();

  router.get('/applications/:idPartner', async (request, response) => {
    const code = request.params.idPartner
    const applications = await partnerApplicationRepository.getApplicationsByPartner(code)
    response.status(200).json({applications: applications})
  })

  router.get('/services/:idPartner', async (request, response) => {
    const code = request.params.idPartner
    const services = await partnerServiceRepository.getServiceByPartner(code)
    response.status(200).json({services: services})
  })

  router.get('/', async (request, response) => {
    const offset: number = request.query.offset as any;
    const limit: number = request.query.limit as any;
    const partners = await partnerRepository.getPartner(offset, limit);
    const total = await partnerRepository.total();

    response.status(200).json({ status: 'ok', partners: partners, total: total });
  });

  router.get('/:id', async (request, response) => {
    const code = request.params.id;
    const partners = await partnerRepository.getPartnerById(code);
    const total = await partnerRepository.total();
    response.status(200).json({ status: 'ok', partners: partners, total: total });
  });

  router.get('/applications/:id', async (request, response) => {
    const code = request.params.id;
    const applications = await partnerRepository.findApplications(code);
    response.status(200).json({ status: 'ok', applications: applications });
  });

  router.post('/', async (request, response) => {
    try {
      const partner: PartnerDto = request.body.partner;
      const result = await partnerRepository.createPartner(partner);
      response.status(201).json({ status: 'ok', partner: result });
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


  router.delete('/:id', async (request, response) => {
    try {
      const code = request.params.id;
      const result = await partnerRepository.deletePartner(code);
      response.status(204).json({ status: 'ok', partner: result });
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


  router.patch('/:id', async (request, response) => {
    try {
      const code = request.params.id;
      const partner: PartnerDto = request.body.partner;
      const result = await partnerRepository.patchPartner(code, partner);
      response.status(200).json({ status: 'ok', partner: result });
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

  router.put('/:id', async (request, response) => {
    try {
      const code = request.params.id;
      const partner: PartnerDto = request.body.partner;
      const result = await partnerRepository.patchPartner(code, partner);
      response.status(200).json({ status: 'ok', partner: result });
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

  return router;
}
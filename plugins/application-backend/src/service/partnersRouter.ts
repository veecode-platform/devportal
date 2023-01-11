import { Router } from "express";
import { RouterOptions } from "./router";
import { PostgresPartnerRepository } from "../modules/partners/repositories/Knex/KnexPartnerReppository";
import { PartnerDto } from "../modules/partners/dtos/PartnerDto";

/** @public */
export async function createPartnersRouter(
    options: RouterOptions,
  ):Promise<Router> {
    const partnerRepository = await PostgresPartnerRepository.create(
        await options.database.getClient(),
      );

      const router = Router();

      router.get('/', async (request, response) => {
        const offset: number = request.query.offset as any;
        const limit: number = request.query.limit as any;
        const partners = await partnerRepository.getPartner(offset, limit);
        response.status(200).json({ status: 'ok', partners: partners });
      });
    
      router.get('/:id', async (request, response) => {
        const code = request.params.id;
        const partners = await partnerRepository.getPartnerById(code);
        response.status(200).json({ status: 'ok', partners: partners });
      });
    
      router.get('/applications/:id', async (request, response) => {
        const code = request.params.id;
        const applications = await partnerRepository.findApplications(code);
        response.status(200).json({ status: 'ok', applications: applications });
      });
    
      router.post('/', async (request, response) => {
        const partner: PartnerDto = request.body.partner;
        const result = await partnerRepository.createPartner(partner);
        response.status(201).json({ status: 'ok', partner: result });
      });
    
      router.delete('/:id', async (request, response) => {
        const code = request.params.id;
        const result = await partnerRepository.deletePartner(code);
        response.status(204).json({ status: 'ok', partner: result });
      });
    
      router.patch('/:id', async (request, response) => {
        const code = request.params.id;
        const partner: PartnerDto = request.body.partner;
        const result = await partnerRepository.patchPartner(code, partner);
        response.status(200).json({ status: 'ok', partner: result });
      });

      return router;
  }
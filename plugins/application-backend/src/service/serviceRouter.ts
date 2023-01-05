import { Router } from 'express';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PostgresServiceRepository } from '../modules/services/repositories/Knex/KnexServiceReppository';

/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}
 async function serviceRouter(options: RouterOptions) {
  const { logger, database } = options;
  let serviceRouter = Router();

serviceRouter.get('/', (request, response) => {
  response.json({message: "OK ESSA É SERVICEROUTER"});
});

const serviceRepository = await PostgresServiceRepository.create(
  await database.getClient(),
);

serviceRouter.delete('/service/:id', async (request, response) => {
  const code = request.params.id;
  const result = await serviceRepository.deleteService(code);
  response.status(204).json({ status: 'ok', service: result });
});

serviceRouter.get('/teste', (request, response) => {
  console.log('aqui foi')
  response.json({message: serviceRepository.getService(0, 10)});
});

serviceRouter.delete('/teste', (request, response) => {
  response.json({message: "OK ESSA É SERVICEROUTER delete"});
});

}
export default serviceRouter;



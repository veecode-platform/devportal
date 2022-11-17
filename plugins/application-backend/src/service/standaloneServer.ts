

import {
  createServiceBuilder,
  DatabaseManager,
  loadBackendConfig,
  useHotMemoize,
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { Config, ConfigReader } from '@backstage/config';
import knexFactory from 'knex';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'application-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const db = useHotMemoize(module, () => {
    const knex = knexFactory({
      client: 'pg',
      connection: {
        user: config.getString('backend.database.connection.user'),
        database:"",
        password: config.getString('backend.database.connection.password'),
        port: config.getNumber('backend.database.connection.port'),
        host: config.getString('backend.database.connection.host'),
      },
      // useNullAsDefault: true,
    });

    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });

    return knex;
  });

  const router = await createRouter({
    logger,
    database: { getClient: async () => db },
    config: config,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/application', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();

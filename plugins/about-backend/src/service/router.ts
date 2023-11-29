import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AboutBackendApi } from '../api';
import { Config } from '@backstage/config';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { adminAccessPermission } from '@internal/plugin-application-common';
import { NotAllowedError } from '@backstage/errors';

/** @public */
export interface RouterOptions {
  aboutBackendApi?: AboutBackendApi;
  logger: Logger;
  config: Config;
  permissions: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, permissions } = options;
  const devToolsBackendApi = options.aboutBackendApi || new AboutBackendApi(logger, config, permissions);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.use(errorHandler());

  router.get('/info', async (req, response) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    const decision = (
      await permissions.authorize(
        [{ permission: adminAccessPermission }],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const info = await devToolsBackendApi.listInfo();

    response.status(200).json(info);
  });

  return router;
}

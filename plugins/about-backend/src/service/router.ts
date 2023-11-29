import {
 // AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
//import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AboutBackendApi } from '../api';
import { Config } from '@backstage/config';
//import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
//import { adminAccessPermission } from '@internal/plugin-application-common';
//import { NotAllowedError } from '@backstage/errors';

/** @public */
export interface RouterOptions {
  aboutBackendApi?: AboutBackendApi;
  logger?: Logger;
  config?: Config;
  permissions?: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  //const { logger, config, permissions } = options;
  const aboutBackendApi = options.aboutBackendApi || new AboutBackendApi(
    //logger, config, permissions
    );

  const router = Router();
  router.use(express.json());

  router.get('/info', async (_, response) => {
    const info = await aboutBackendApi.listInfo();

    response.status(200).json(info);
  });

  return router;
}

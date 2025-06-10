import {
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AboutBackendApi } from '../api';
import { Config } from '@backstage/config';


/** @public */
export interface RouterOptions {
  aboutBackendApi?: AboutBackendApi;
  logger?: Logger;
  config?: Config;
  permissions?: PermissionEvaluator;
}

export async function createRouter(
): Promise<express.Router> {
  const aboutBackendApi = new AboutBackendApi();

  const router = Router();
  router.use(express.json());

  router.get('/info', async (_res, response) => {
    const info = await aboutBackendApi.listInfo();

    response.status(200).json(info);
  });

  return router;
}

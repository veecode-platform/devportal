import { createRouter } from '@internal/plugin-application-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    database: env.database,
    permissions: env.permissions,
    //identity: env.identity
  });
}
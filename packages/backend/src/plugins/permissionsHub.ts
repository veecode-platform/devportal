import { createRouter } from '@internal/backstage-plugin-veecode-platform-permissions-hub-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';


export default async function createPlugin({
    logger,
    permissions,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      permissions
    });
  }
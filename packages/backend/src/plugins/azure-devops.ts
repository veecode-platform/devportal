import { createRouter } from '@backstage-community/plugin-azure-devops-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    config: env.config,
    reader: env.reader,
    permissions: env.permissions
  });
}
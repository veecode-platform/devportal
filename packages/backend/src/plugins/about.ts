import { createRouter } from '@internal/plugin-about-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    config: env.config,
    permissions: env.permissions,
  });
}
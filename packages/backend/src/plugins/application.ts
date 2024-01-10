import { createRouter } from '@veecode-platform/plugin-application-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';

export default async function createPlugin(
  env: PluginEnvironment
): Promise<Router> {
  const discovery = env.discovery
  return await createRouter({
    config: env.config,
    logger: env.logger,
    database:env.database,
    permissions: env.permissions,
    identity: DefaultIdentityClient.create({
      discovery,
      issuer: await env.discovery.getExternalBaseUrl('auth')
      }),
  });
}
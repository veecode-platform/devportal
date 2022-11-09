// basic policy

//import { IdentityClient } from '@backstage/plugin-auth-node';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy, PolicyQuery } from '@backstage/plugin-permission-node';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new ExamplePermissionPolicy(),
    identity: env.identity,
  });
}

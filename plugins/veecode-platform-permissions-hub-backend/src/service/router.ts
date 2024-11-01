import { errorHandler } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { clusterExplorerPermissions } from '@veecode-platform/backstage-plugin-cluster-explorer-common';
import { githubWorkflowsPermissions } from '@veecode-platform/backstage-plugin-github-workflows-common';
import { gitlabPipelinesPermissions } from '@veecode-platform/backstage-plugin-gitlab-pipelines-common';
import { adminAccessPermissions } from '@veecode-platform/plugin-veecode-platform-common'


export interface RouterOptions {
  logger: LoggerService;
  permissions: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger/*, permissions */} = options;

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: [...clusterExplorerPermissions, ...gitlabPipelinesPermissions, ...githubWorkflowsPermissions, ...adminAccessPermissions],
  });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(permissionIntegrationRouter);

  router.use(errorHandler());
  return router;
}

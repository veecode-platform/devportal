import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { clusterExplorerPermissions } from '@veecode-platform/backstage-plugin-cluster-explorer-common';
import { githubWorkflowsPermissions } from '@veecode-platform/backstage-plugin-github-workflows-common';
import { gitlabPipelinesPermissions } from '@veecode-platform/backstage-plugin-gitlab-pipelines-common';
import { adminAccessPermissions } from '@veecode-platform/plugin-veecode-platform-common'
/**
 * veecodePlatformPermissionsHubPlugin backend plugin 
 *
 * @public
 */
export const veecodePlatformPermissionsHubPlugin = createBackendPlugin({
  pluginId: 'veecode-platform-permissions-hub',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        //permissions: coreServices.permissions,
        permissionsregistry: coreServices.permissionsRegistry,
      },
      async init({
        httpRouter,
        logger,
        //permissions,
        permissionsregistry
      }) {
        permissionsregistry.addPermissions([...clusterExplorerPermissions, ...gitlabPipelinesPermissions, ...githubWorkflowsPermissions, ...adminAccessPermissions])
        httpRouter.use(
          await createRouter({
            logger,
            //permissions
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

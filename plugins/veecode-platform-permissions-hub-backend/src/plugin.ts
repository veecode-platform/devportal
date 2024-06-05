import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

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
        permissions: coreServices.permissions,
      },
      async init({
        httpRouter,
        logger,
        permissions
      }) {
        httpRouter.use(
          await createRouter({
            logger,
            permissions
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

import {  createBackendFeatureLoader, coreServices } from '@backstage/backend-plugin-api';

export default createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
    },
    *loader({ config }) {
      if (config.getOptionalConfig('enabledPlugins')) {
        yield import('@roadiehq/backstage-plugin-argo-cd-backend/alpha');
        //yield import('@roadiehq/backstage-plugin-aws-auth');
        yield import('@backstage-community/plugin-azure-devops-backend');
        yield import('@backstage-community/plugin-explore-backend');
        yield import('@backstage-community/plugin-vault-backend');
        yield import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
        yield import('@veecode-platform/plugin-kong-service-manager-backend');
      }
    },
  });
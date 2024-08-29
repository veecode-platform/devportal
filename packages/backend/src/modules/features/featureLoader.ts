import {  createBackendFeatureLoader, coreServices } from '@backstage/backend-plugin-api';

export default createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
    },
    *loader({ config }) {
      if (config.getOptionalString('enabledPlugins')) {
        //yield import('@roadiehq/backstage-plugin-argo-cd-backend');
        //yield import('@roadiehq/backstage-plugin-aws-auth');
        //yield import('@backstage-community/plugin-azure-devops-backend/');
        //yield import('@backstage-community/plugin-explore-backend');
        //yield import('@veecode-platform/backstage-plugin-infracost-backend');
        yield import('@backstage-community/plugin-vault-backend');
        yield import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
        //yield import('@internal/plugin-about-backend'); 
      }
    },
  });
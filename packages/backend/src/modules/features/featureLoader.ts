import { createBackendFeatureLoader, coreServices } from '@backstage/backend-plugin-api';
import { kubernetesModuleCustomExtension } from '../kubernetes/kubernetesExtension';
import { catalogModuleInfracostProcessor, infracostPlugin } from '@veecode-platform/backstage-plugin-infracost-backend/alpha';



export default createBackendFeatureLoader({
  deps: {
    config: coreServices.rootConfig,
  },
  *loader({ config }) {
    //yield import('@roadiehq/backstage-plugin-aws-auth');

    //argocd
    if (config.getOptionalConfig('enabledPlugins.argocd')) {
      yield import('@roadiehq/backstage-plugin-argo-cd-backend/alpha');
    }

    //vault
    if (config.getOptionalConfig('enabledPlugins.vault')) {
      yield import('@backstage-community/plugin-vault-backend');
    }

    //azure
    if (config.getOptionalConfig('enabledPlugins.azureDevops')) {
      yield import('@backstage-community/plugin-azure-devops-backend');
    }

    //kubernetes
    if (config.getOptionalConfig('enabledPlugins.kubernetes')) {
      yield import('@backstage/plugin-kubernetes-backend/alpha')
      yield kubernetesModuleCustomExtension
    }

    //rbac
    if (config.getOptionalConfig('enabledPlugins.rbac')) {
      yield import('@janus-idp/backstage-plugin-rbac-backend');
      yield import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
    }

    //infracost
    if (config.getOptionalConfig('enabledPlugins.infracost')) {
      yield catalogModuleInfracostProcessor
      yield infracostPlugin
    }
  }
});

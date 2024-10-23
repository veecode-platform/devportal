import { createBackendFeatureLoader, coreServices } from '@backstage/backend-plugin-api';
import { kubernetesModuleCustomExtension } from '../kubernetes/kubernetesExtension';
import { catalogModuleInfracostProcessor, infracostPlugin } from '@veecode-platform/backstage-plugin-infracost-backend/alpha';
import { catalogModuleCustomExtensions } from '../catalog/catalogExtension';

export default createBackendFeatureLoader({
  deps: {
    config: coreServices.rootConfig,
  },
  *loader({ config }) {
    //yield import('@roadiehq/backstage-plugin-aws-auth');

    //argocd
    if (config.getBoolean('enabledPlugins.argocd')) {
      yield import('@roadiehq/backstage-plugin-argo-cd-backend/alpha');
    }

    //vault
    if (config.getBoolean('enabledPlugins.vault')) {
      yield import('@backstage-community/plugin-vault-backend');
    }

    //azure
    if (config.getBoolean('enabledPlugins.azureDevops')) {
      yield import('@backstage-community/plugin-azure-devops-backend');
    }

    //kubernetes
    if (config.getBoolean('enabledPlugins.kubernetes')) {
      yield import('@backstage/plugin-kubernetes-backend/alpha')
      yield kubernetesModuleCustomExtension
    }

    //rbac
    if (config.getBoolean('enabledPlugins.rbac')) {
      yield import('@janus-idp/backstage-plugin-rbac-backend');
      yield import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
    }
    else{
      yield import('@backstage/plugin-permission-backend-module-allow-all-policy');
    }

    if(config.getBoolean('platform.guest.enabled')){
      yield import('@backstage/plugin-auth-backend-module-guest-provider');
    }

    //infracost
    if (config.getBoolean('enabledPlugins.infracost')) {
      yield catalogModuleInfracostProcessor
      yield infracostPlugin
    }

    //gitlab
    if (config.getBoolean('enabledPlugins.gitlab')) {
      yield catalogModuleCustomExtensions;
    }
  }
});

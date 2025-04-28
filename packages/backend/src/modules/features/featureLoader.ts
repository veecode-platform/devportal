import { createBackendFeatureLoader, coreServices } from '@backstage/backend-plugin-api';
import { kubernetesModuleCustomExtension } from '../kubernetes/kubernetesExtension';
import { catalogModuleInfracostProcessor, infracostPlugin } from '@veecode-platform/backstage-plugin-infracost-backend/alpha';
import { catalogModuleCustomExtensions } from '../catalog/catalogExtension';
import { gitlabPlugin } from '@immobiliarelabs/backstage-plugin-gitlab-backend';

export default createBackendFeatureLoader({
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
  },
  *loader({ config, logger }) {
    //yield import('@roadiehq/backstage-plugin-aws-auth');
    logger.info('---- Loading Feature Loader Plugins ----');
    //argocd
    if (config.getBoolean('enabledPlugins.argocd')) {
      yield import('@roadiehq/backstage-plugin-argo-cd-backend/alpha');
      logger.info('@roadiehq/backstage-plugin-argo-cd-backend/alpha');
    }

    //vault
    if (config.getBoolean('enabledPlugins.vault')) {
      yield import('@backstage-community/plugin-vault-backend');
      logger.info('@backstage-community/plugin-vault-backend');
    }

    //azure
    if (config.getBoolean('enabledPlugins.azureDevops')) {
      yield import('@backstage-community/plugin-azure-devops-backend');
      logger.info('@backstage-community/plugin-azure-devops-backend');
    }

    //kubernetes
    if (config.getBoolean('enabledPlugins.kubernetes')) {
      yield import('@backstage/plugin-kubernetes-backend/alpha')
      logger.info('@backstage/plugin-kubernetes-backend/alpha')
      yield kubernetesModuleCustomExtension
      logger.info('kubernetesModuleCustomExtension')
    }

    //rbac
    if (config.getBoolean('enabledPlugins.rbac')) {
      yield import('@backstage-community/plugin-rbac-backend');
      logger.info('@backstage-community/plugin-rbac-backend');
      yield import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
      logger.info('@internal/backstage-plugin-veecode-platform-permissions-hub-backend');
    }
    else {
      yield import('@backstage/plugin-permission-backend')
      logger.info('@backstage/plugin-permission-backend')
      yield import('@backstage/plugin-permission-backend-module-allow-all-policy');
      logger.info('@backstage/plugin-permission-backend-module-allow-all-policy');
    }

    //guest
    if (config.getBoolean('platform.guest.enabled')) {
      yield import('@backstage/plugin-auth-backend-module-guest-provider');
      logger.info('@backstage/plugin-auth-backend-module-guest-provider');
    }

    //infracost
    if (config.getBoolean('enabledPlugins.infracost')) {
      yield catalogModuleInfracostProcessor
      logger.info('catalogModuleInfracostProcessor')
      yield infracostPlugin
      logger.info('infracostPlugin')
    }

    //kong
    if (config.getBoolean('enabledPlugins.kong')) {
      yield import('@veecode-platform/plugin-kong-service-manager-backend')
      logger.info('@veecode-platform/plugin-kong-service-manager-backend')
    }

    // vee
    if (config.getBoolean('enabledPlugins.vee')) {
      yield import('@veecode-platform/backstage-plugin-vee-backend')
      logger.info('@veecode-platform/plugin-vee-backend')
    }

    // sonarqube
    if (config.getBoolean('enabledPlugins.sonarqube')) {
      yield import('@backstage-community/plugin-sonarqube-backend')
      logger.info('@backstage-community/plugin-sonarqube-backend')
    }

    //gitlab
    if (config.getBoolean('enabledPlugins.gitlab')) {
      yield catalogModuleCustomExtensions;
      logger.info('catalogModuleCustomExtensions');
      yield gitlabPlugin;
      logger.info('gitlabPlugin from "@immobiliarelabs/backstage-plugin-gitlab-backend"');
    }
    logger.info('----------------------------------------');
  }
});

import {
  createBackendFeatureLoader,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  catalogModuleInfracostProcessor,
  infracostPlugin,
} from '@veecode-platform/backstage-plugin-infracost-backend/alpha';
import { catalogModuleCustomExtensions } from '../catalog/catalogExtension';
import { gitlabPlugin } from '@immobiliarelabs/backstage-plugin-gitlab-backend';
import { customGithubAuthProvider } from '../auth/githubCustomResolver';
import { keycloakBackendModuleTransformer } from '../keycloak/keycloakEntityTransformer'

export default createBackendFeatureLoader({
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
  },
  *loader({ config, logger }) {
    //yield import('@roadiehq/backstage-plugin-aws-auth');
    logger.info('---- Loading Feature Loader Plugins ----');

    //azure devops
    if (config.getBoolean('platform.enabledPlugins.azureDevops')) {
      logger.info('Setting up Azure DevOps plugins');
      yield import('@backstage-community/plugin-azure-devops-backend');
      yield import('@backstage/plugin-catalog-backend-module-azure');
      yield import('@backstage-community/plugin-scaffolder-backend-module-dotnet');
      yield import('@backstage-community/plugin-catalog-backend-module-azure-devops-annotator-processor');
      logger.info('Done setting up Azure DevOps plugins');
    }

    //keycloak
    if (config.getBoolean('platform.enabledPlugins.keycloak')) {
      logger.info('Setting up Keycloak plugins');
      yield import('@backstage/plugin-auth-backend-module-oidc-provider');
      yield import('@backstage-community/plugin-catalog-backend-module-keycloak');
      yield keycloakBackendModuleTransformer ;
      logger.info('Done setting up Keycloak plugins');
    }

    //argocd
    if (config.getBoolean('platform.enabledPlugins.argocd')) {
      yield import('@roadiehq/backstage-plugin-argo-cd-backend');
      logger.info('@roadiehq/backstage-plugin-argo-cd-backend');
    }

    //vault
    if (config.getBoolean('platform.enabledPlugins.vault')) {
      yield import('@internal/plugin-vault-backend');
      logger.info('@internal/plugin-vault-backend');
    }

    //guest
    if (config.getBoolean('platform.guest.enabled')) {
      yield import('@backstage/plugin-auth-backend-module-guest-provider');
      logger.info('@backstage/plugin-auth-backend-module-guest-provider');
    }

    //infracost
    if (config.getBoolean('platform.enabledPlugins.infracost')) {
      yield catalogModuleInfracostProcessor;
      logger.info('catalogModuleInfracostProcessor');
      yield infracostPlugin;
      logger.info('infracostPlugin');
    }

    //kong
    if (config.getBoolean('platform.enabledPlugins.kong')) {
      yield import('@veecode-platform/plugin-kong-service-manager-backend');
      logger.info('@veecode-platform/plugin-kong-service-manager-backend');
    }

    // vee
    //if (config.getBoolean('enabledPlugins.vee')) {
    //  yield import('@veecode-platform/backstage-plugin-vee-backend');
    //  logger.info('@veecode-platform/plugin-vee-backend');
    //}

    // sonarqube
    if (config.getBoolean('platform.enabledPlugins.sonarqube')) {
      yield import('@backstage-community/plugin-sonarqube-backend');
      logger.info('@backstage-community/plugin-sonarqube-backend');
    }

    //gitlab
    if (config.getBoolean('platform.enabledPlugins.gitlab')) {
      yield catalogModuleCustomExtensions;
      logger.info('catalogModuleCustomExtensions');
      yield gitlabPlugin;
      logger.info(
        'gitlabPlugin from "@immobiliarelabs/backstage-plugin-gitlab-backend"',
      );
    }

    //github guest
    if(config.getOptionalBoolean('platform.guest.demo') && config.getOptionalBoolean('platform.guest.enabled')){
      yield customGithubAuthProvider
      logger.info('customGithubAuthProvider from githubCustomResolver.ts');
    }
    else{
      yield import('@backstage/plugin-auth-backend-module-github-provider');
      logger.info('@backstage/plugin-auth-backend-module-github-provider');
    }
    logger.info('----------------------------------------');
  },
});

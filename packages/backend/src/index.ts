import { createBackend } from '@backstage/backend-defaults';
import customPluginsLoader from './modules/features/featureLoader';
import { catalogModuleVeeCodeProcessor } from '@veecode-platform/plugin-veecode-platform-module/alpha';
import { keycloakBackendModuleTransformer } from './modules/keycloak/keycloakEntityTransformer';
import exploreToolProviderModule from './modules/explore/exploreToolProviderModule';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { getDefaultServiceFactories } from './defaultServiceFactories';
import { dynamicPluginsFeatureLoader } from '@backstage/backend-dynamic-feature-service';
import { PackageRoles } from '@backstage/cli-node';
import * as path from 'path';
import { CommonJSModuleLoader } from './modules/loader';
import { healthCheckPlugin } from './modules/healthcheck/healthcheck';
import {
  pluginIDProviderService,
  rbacDynamicPluginsProvider,
} from './modules/rbac/rbacDynamicPluginsModule';

// Create a logger to cover logging static initialization tasks
const staticLogger = WinstonLogger.create({
  meta: { service: 'developer-hub-init' },
});
staticLogger.info('Starting Developer Hub backend');

const backend = createBackend();

const defaultServiceFactories = getDefaultServiceFactories({
  logger: staticLogger,
});
defaultServiceFactories.forEach(serviceFactory => {
  backend.add(serviceFactory);
});

backend.add(
  dynamicPluginsFeatureLoader({
    schemaLocator(pluginPackage) {
      const platform = PackageRoles.getRoleInfo(
        pluginPackage.manifest.backstage.role,
      ).platform;
      return path.join(
        platform === 'node' ? 'dist' : 'dist-scalprum',
        'configSchema.json',
      );
    },
    moduleLoader: logger => new CommonJSModuleLoader(logger),
  }),
);

// healthcheck
backend.add(healthCheckPlugin);

// app
backend.add(import('@backstage/plugin-app-backend'));

// catalog
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud'));
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab-org'));
backend.add(
  import('@backstage-community/plugin-catalog-backend-module-keycloak'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
backend.add(keycloakBackendModuleTransformer);
backend.add(catalogModuleVeeCodeProcessor);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@backstage/plugin-catalog-backend-module-openapi'));

// rbac
backend.add(import('@backstage-community/plugin-rbac-backend'));

backend.add(pluginIDProviderService);
backend.add(rbacDynamicPluginsProvider);

// scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@roadiehq/scaffolder-backend-module-utils'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
backend.add(
  import('@backstage-community/plugin-scaffolder-backend-module-annotator'),
);

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'));
// backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider'));

// proxy
backend.add(import('@backstage/plugin-proxy-backend'));

// techdocs
backend.add(import('@backstage/plugin-techdocs-backend'));

// search plugin
backend.add(import('@backstage/plugin-search-backend'));
// search engine
backend.add(import('@backstage/plugin-search-backend-module-pg'));
// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// feature loader
backend.add(customPluginsLoader);

// about
backend.add(import('@internal/plugin-about-backend'));

// explore
backend.add(exploreToolProviderModule);

backend.add(import('@internal/plugin-dynamic-plugins-info-backend'));
backend.add(import('@internal/plugin-scalprum-backend'));
backend.add(import('@internal/plugin-licensed-users-info-backend'));

backend.start();

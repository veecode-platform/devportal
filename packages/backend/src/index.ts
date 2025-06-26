import { createBackend } from '@backstage/backend-defaults';
// import { scaffolderModuleCustomExtensions } from './modules/scaffolder/scaffolderExtension';
// import { customGithubAuthProvider } from './modules/auth/githubCustomResolver';
// import { customGitlabAuthProvider } from './modules/auth/gitlabCustomResolver';
import customPluginsLoader from './modules/features/featureLoader';
// import { MyRootHealthService } from './modules/healthcheck/health';
// import {
//   coreServices,
//   createServiceFactory,
// } from '@backstage/backend-plugin-api';
import { catalogModuleVeeCodeProcessor } from '@veecode-platform/plugin-veecode-platform-module/alpha';
import { keycloakBackendModuleTransformer } from './modules/keycloak/keycloakEntityTransformer';
import exploreToolProviderModule from './modules/explore/exploreToolProviderModule';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { getDefaultServiceFactories } from './defaultServiceFactories';
import { PackageRoles } from '@backstage/cli-node';
import * as path from 'path';
import {
  CommonJSModuleLoader,
  dynamicPluginsFeatureLoader,
  dynamicPluginsFrontendServiceRef,
} from '@backstage/backend-dynamic-feature-service';
import { healthCheckPlugin } from './modules/healthcheck/healthcheck';
import { createServiceFactory } from '@backstage/backend-plugin-api';
// import {
//   pluginIDProviderService,
//   rbacDynamicPluginsProvider,
// } from './modules/rbac/rbacDynamicPluginsModule';

// Create a logger to cover logging static initialization tasks
const staticLogger = WinstonLogger.create({
  meta: { service: 'developer-hub-init' },
});
staticLogger.info('Starting backend');

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

    moduleLoader: logger =>
      new CommonJSModuleLoader({
        logger,
        // Customize dynamic plugin packager resolution to support the case
        // of dynamic plugin wrapper packages.
        customResolveDynamicPackage(
          _,
          searchedPackageName,
          scannedPluginManifests,
        ) {
          for (const [realPath, pkg] of scannedPluginManifests.entries()) {
            // A dynamic plugin wrapper package has a direct dependency to the wrapped package
            if (
              Object.keys(pkg.dependencies ?? {}).includes(searchedPackageName)
            ) {
              const searchPath = path.resolve(realPath, 'node_modules');
              try {
                const resolvedPath = require.resolve(
                  `${searchedPackageName}/package.json`,
                  {
                    paths: [searchPath],
                  },
                );
                logger.info(
                  `Resolved '${searchedPackageName}' at ${resolvedPath}`,
                );
                return resolvedPath;
              } catch (e) {
                this.logger.error(
                  `Error when resolving '${searchedPackageName}' with search path: '[${searchPath}]'`,
                  e instanceof Error ? e : undefined,
                );
              }
            }
          }
          return undefined;
        },
      }),
  }),
);

if (
  (process.env.ENABLE_STANDARD_MODULE_FEDERATION || '').toLocaleLowerCase() !==
  'true'
) {
  // When the `dynamicPlugins` entry exists in the configuration, the upstream dynamic plugins backend feature loader
  // also loads the `dynamicPluginsFrontendServiceRef` service that installs an http router to serve
  // standard Module Federation assets for every installed dynamic frontend plugin.
  // For now in RHDH the old frontend application doesn't use standard module federation and, by default,
  // exported RHDH dynamic frontend plugins don't contain standard module federation assets.
  // That's why we disable (bu overriding it with a noop) this service unless stadard module federation use
  // is explicitly requested.
  backend.add(
    createServiceFactory({
      service: dynamicPluginsFrontendServiceRef,
      deps: {},
      factory: () => ({
        setResolverProvider() {},
      }),
    }),
  );
}

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

// scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@roadiehq/scaffolder-backend-module-utils'));
// backend.add(
//   import(
//     '@veecode-platform/backstage-plugin-scaffolder-backend-module-veecode-extensions'
//   ),
// );
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));

backend.add(
  import('@backstage-community/plugin-scaffolder-backend-module-annotator'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));


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

// events
backend.add(import('@backstage/plugin-events-backend'));

// signals
backend.add(import('@backstage/plugin-signals-backend'));

// notifications
backend.add(import('@backstage/plugin-notifications-backend'));

// feature loader
backend.add(customPluginsLoader);

// about
backend.add(import('@internal/plugin-about-backend'));

// explore
backend.add(exploreToolProviderModule);

// healthcheck
// backend.add(
//   createServiceFactory({
//     service: coreServices.rootHealth,
//     deps: {},
//     async factory({}) {
//       return new MyRootHealthService();
//     },
//   }),
// );

//rbac
staticLogger.info('Adding RBAC backend module')
backend.add(import('@backstage-community/plugin-rbac-backend'));
backend.add(import('@internal/backstage-plugin-veecode-platform-permissions-hub-backend'))
staticLogger.info('RBAC backend module added');
// backend.add(pluginIDProviderService);
// backend.add(rbacDynamicPluginsProvider);


backend.add(healthCheckPlugin);
backend.add(import('@internal/plugin-dynamic-plugins-info-backend'));
backend.add(import('@internal/plugin-scalprum-backend'));
backend.add(import('@internal/plugin-licensed-users-info-backend'));

backend.start();

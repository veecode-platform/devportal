import { createBackend } from '@backstage/backend-defaults';
//import { scaffolderModuleCustomExtensions } from './modules/scaffolder/scaffolderExtension';
import { customGithubAuthProvider } from './modules/auth/githubCustomResolver';
import { customGitlabAuthProvider } from './modules/auth/gitlabCustomResolver';
import customPluginsLoader from './modules/features/featureLoader';
import { MyRootHealthService } from './modules/healthcheck/health';
import { coreServices, createServiceFactory } from '@backstage/backend-plugin-api';
import { catalogModuleVeeCodeProcessor } from '@veecode-platform/plugin-veecode-platform-module/alpha';
import { keycloakBackendModuleTransformer } from './modules/keycloak/keycloakEntityTransformer';
import exploreToolProviderModule from './modules/explore/exploreToolProviderModule';

const backend = createBackend();

//app 
backend.add(import('@backstage/plugin-app-backend'));

//catalog
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@backstage-community/plugin-catalog-backend-module-keycloak'));
backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
backend.add(keycloakBackendModuleTransformer)
backend.add(catalogModuleVeeCodeProcessor);

//backend.add(catalogModuleInfracostProcessor);
//backend.add(import('@backstage/plugin-catalog-backend-module-azure/alpha')); validate
//backend.add(import('@backstage/plugin-catalog-backend-module-github-org')); validate

//scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@roadiehq/scaffolder-backend-module-utils'));
backend.add(import('@veecode-platform/backstage-plugin-scaffolder-backend-module-veecode-extensions'))
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));


// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'))
backend.add(customGithubAuthProvider)
backend.add(customGitlabAuthProvider)

//proxy
backend.add(import('@backstage/plugin-proxy-backend'));

//techdocs
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
// search engine
backend.add(import('@backstage/plugin-search-backend-module-pg/alpha'));
// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

//feature loader
backend.add(customPluginsLoader)

//about
backend.add(import('@internal/plugin-about-backend'))

//explore
backend.add(exploreToolProviderModule);

//healthcheck
backend.add(
    createServiceFactory({
      service: coreServices.rootHealth,
      deps: {},
      async factory({}) {
        return new MyRootHealthService();
      },
    }),
  );



backend.start();
import { createBackend } from '@backstage/backend-defaults';
import { catalogModuleCustomExtensions } from './modules/catalog/catalogExtension';
import { scaffolderModuleCustomExtensions } from './modules/scaffolder/scaffolderExtension';
import { kubernetesModuleCustomExtension } from './modules/kubernetes/kubernetesExtension';
import { customGithubAuthProvider } from './modules/auth/githubCustomResolver';
import { customGitlabAuthProvider } from './modules/auth/gitlabCustomResolver';
import customPluginsLoader from './modules/features/featureLoader';
import { infracostPlugin } from '@veecode-platform/backstage-plugin-infracost-backend/alpha';
import { MyRootHealthService } from './modules/healthcheck/health';
import { coreServices, createServiceFactory } from '@backstage/backend-plugin-api';
//import  kongServiceManagerPlugin  from '@veecode-platform/plugin-kong-service-manager-backend';

const backend = createBackend();

//app 
backend.add(import('@backstage/plugin-app-backend/alpha'));

//catalog
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@janus-idp/backstage-plugin-keycloak-backend/alpha'));
backend.add(infracostPlugin);
backend.add(catalogModuleCustomExtensions);

//backend.add(catalogModuleInfracostProcessor);
//backend.add(import('@backstage/plugin-catalog-backend-module-azure/alpha')); validate
//backend.add(import('@backstage/plugin-catalog-backend-module-github-org')); validate

//scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(scaffolderModuleCustomExtensions);
//backend.add(import('@roadiehq/scaffolder-backend-module-utils/new-backend')); added to custom scaffolder extension

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'))
//backend.add(import('@backstage/plugin-auth-backend-module-github-provider')); //github option
//backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider')); //gitlab option
backend.add(customGithubAuthProvider)
backend.add(customGitlabAuthProvider)

// permission plugin
//backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(import('@janus-idp/backstage-plugin-rbac-backend'));

//kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));
backend.add(kubernetesModuleCustomExtension)

//proxy
backend.add(import('@backstage/plugin-proxy-backend/alpha'));

//techdocs
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
// search engine
backend.add(import('@backstage/plugin-search-backend-module-pg/alpha'));
// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

//feature loader
backend.add(customPluginsLoader)

//about
backend.add(import('@internal/plugin-about-backend'))

//kong service manager
//backend.add(kongServiceManagerPlugin);

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
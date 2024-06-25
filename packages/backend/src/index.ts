import { createBackend } from '@backstage/backend-defaults';
import { legacyPlugin } from '@backstage/backend-common';
import { catalogModuleCustomExtensions } from "./catalogExtensions"
import { scaffolderModuleCustomExtensions } from './scaffolderExtensions';
//import { legacyPlugin } from './legacyPlugins';

const backend = createBackend();

//app 
backend.add(import('@backstage/plugin-app-backend/alpha'));

//catalog
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@janus-idp/backstage-plugin-keycloak-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-azure/alpha'));
backend.add(catalogModuleCustomExtensions());

//scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@roadiehq/scaffolder-backend-module-utils/new-backend'));
backend.add(scaffolderModuleCustomExtensions());

//auth
//backend.add(import('@backstage/plugin-auth-backend'));
//backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
//backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider'));
backend.add(legacyPlugin('auth', import('./plugins/auth')));

//search
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-pg/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

//permission
backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(import('@backstage/plugin-permission-backend-module-allow-all-policy'));
//backend.add(import('@janus-idp/backstage-plugin-rbac-backend'));

//techdocs
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

//kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));

backend.start();
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { vulnerabilitiesApiRef } from './api/vulnerabilitiesApi';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { VulnerabilitiesClient } from './api/vulnerabititilesClient';

export const vulnerabilitiesPlugin = createPlugin({
  id: 'vulnerabilities',
  apis: [
    createApiFactory({
      api: vulnerabilitiesApiRef,
      deps: { configApi: configApiRef, catalogApi: catalogApiRef },
      factory: ({configApi, catalogApi}) => {
        return new VulnerabilitiesClient(configApi,catalogApi)
      }
    })
  ],
  routes: {
    root: rootRouteRef,
  },
});

// export const VulnerabilitiesPage = vulnerabilitiesPlugin.provide(
//   createRoutableExtension({
//     name: 'VulnerabilitiesPage',
//     component: () =>
//       import('./components/ExampleComponent').then(m => m.ExampleComponent),
//     mountPoint: rootRouteRef,
//   }),
// );

export const VulnerabilitiesPage = vulnerabilitiesPlugin.provide(
  createRoutableExtension({
    name: 'VulnerabilitiesPage',
    component: () =>
      import('./components/vulnerabilitiesHomePage').then(m => m.VulnerabilitiesHomePage),
    mountPoint: rootRouteRef,
  }),
);

export const VulnerabilitiesOverviewCard = vulnerabilitiesPlugin.provide(
  createRoutableExtension({
    name: 'VulnerabilitiesOverviewCard',
    component: () =>
      import('./components/vulnerabilitiesOverviewCard').then(m => m.VulnerabilitiesOverviewCard),
    mountPoint: rootRouteRef,
  }),
);

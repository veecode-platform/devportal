import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const vulnerabilitiesPlugin = createPlugin({
  id: 'vulnerabilities',
  routes: {
    root: rootRouteRef,
  },
});

export const VulnerabilitiesPage = vulnerabilitiesPlugin.provide(
  createRoutableExtension({
    name: 'VulnerabilitiesPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

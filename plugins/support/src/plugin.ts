import { createPlugin, createRoutableExtension, createApiFactory, configApiRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { licenseKeyApiRef, LicenseKeyApiClient } from './api';

export const supportPlugin = createPlugin({
  id: 'support',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: licenseKeyApiRef,
      deps: { configApi: configApiRef},
      factory: ({configApi}) => {
        return new LicenseKeyApiClient({
          configApi: configApi,
        })
      }
    })
  ]
});

export const SupportPage = supportPlugin.provide(
  createRoutableExtension({
    name: 'SupportPage',
    component: () =>
      import('./components/SupportPage').then(m => m.SupportPage),
    mountPoint: rootRouteRef,
  }),
);

import { createApiFactory, createPlugin, createRoutableExtension, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { AboutClient, aboutApiRef } from './api';

export const aboutPlugin = createPlugin({
  id: 'about',
  apis: [
    createApiFactory({
      api: aboutApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new AboutClient({ discoveryApi, identityApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const AboutPage = aboutPlugin.provide(
  createRoutableExtension({
    name: 'AboutPage',
    component: () =>
      import('./components/AboutPage').then(m => m.AboutPage),
    mountPoint: rootRouteRef,
  }),
);

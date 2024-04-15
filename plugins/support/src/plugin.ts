import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const supportPlugin = createPlugin({
  id: 'support',
  routes: {
    root: rootRouteRef,
  },
});

export const SupportPage = supportPlugin.provide(
  createRoutableExtension({
    name: 'SupportPage',
    component: () =>
      import('./components/SupportPage').then(m => m.SupportPage),
    mountPoint: rootRouteRef,
  }),
);

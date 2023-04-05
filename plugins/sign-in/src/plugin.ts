import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const signInPlugin = createPlugin({
  id: 'sign-in',
  routes: {
    root: rootRouteRef,
  },
});

export const SignInPage: (props: any) => JSX.Element = signInPlugin.provide(
  createRoutableExtension({
    name: 'SignInPage',
    component: () =>
      import('./components/SignInPage').then(m => m.SignInPage),
    mountPoint: rootRouteRef,
  }),
);

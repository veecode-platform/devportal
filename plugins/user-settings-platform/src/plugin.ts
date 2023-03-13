import {
  createPlugin,
  createRoutableExtension,
  createRouteRef,
} from '@backstage/core-plugin-api';

export const settingsRouteRef = createRouteRef({
  id: 'user-settings-platform',
});

/** @public */
export const userSettingsPlugin = createPlugin({
  id: 'user-settings-platform',
  routes: {
    settingsPage: settingsRouteRef,
  },
});

/** @public */
export const UserSettingsPage = userSettingsPlugin.provide(
  createRoutableExtension({
    name: 'UserSettingsPage',
    component: () =>
      import('./components/SettingsPage').then(m => m.SettingsPage),
    mountPoint: settingsRouteRef,
  }),
);

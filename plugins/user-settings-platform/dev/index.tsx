// import React from 'react';
// import { createDevApp } from '@backstage/dev-utils';
// import { userSettingsPlatformPlugin, UserSettingsPlatformPage } from '../src/plugin';

// createDevApp()
//   .registerPlugin(userSettingsPlatformPlugin)
//   .addPage({
//     element: <UserSettingsPlatformPage />,
//     title: 'Root Page',
//     path: '/user-settings-platform'
//   })
//   .render();

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { userSettingsPlugin, UserSettingsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(userSettingsPlugin)
  .addPage({
    title: 'Settings',
    element: <UserSettingsPage />,
  })
  .render();

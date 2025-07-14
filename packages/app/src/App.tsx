/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app/src/App.tsx
 *
 * Original Copyright (c) 2022 Red Hat Developer (or the exact copyright holder from the original source, please verify in their repository)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import GlobalStyles from '@mui/material/GlobalStyles';

import { apis } from './apis';
import { StaticPlugins } from './components/DynamicRoot/DynamicRoot';
import ScalprumRoot from './components/DynamicRoot/ScalprumRoot';
import { DefaultMainMenuItems } from './consts';

// Statically integrated frontend plugins
const { dynamicPluginsInfoPlugin, ...dynamicPluginsInfoPluginModule } =
  await import('@internal/plugin-dynamic-plugins-info');

// The base UI configuration, these values can be overridden by values
// specified in external configuration files
const baseFrontendConfig = {
  context: 'frontend',
  data: {
    dynamicPlugins: {
      frontend: {
        'default.main-menu-items': DefaultMainMenuItems,
        // please keep this in sync with plugins/dynamic-plugins-info/app-config.janus-idp.yaml
        'internal.plugin-dynamic-plugins-info': {
          appIcons: [
            { name: 'pluginsInfoIcon', importName: 'PluginsInfoIcon' },
            { name: 'adminIcon', importName: 'AdminIcon' },
            {name: 'rbacIcon', importName: 'RbacIcon' },
          ],
          dynamicRoutes: [
            {
              path: '/extensions',
              importName: 'DynamicPluginsInfoPage',
              menuItem: { text: 'Plugins', icon: 'pluginsInfoIcon' },
            },
            {
              path: '/rbac',
              importName: 'RbacPage',
              menuItem: { text: 'RBAC', icon: 'rbacIcon' },
            },
          ],
          mountPoints: [
            {
              mountPoint: 'internal.plugins/tab',
              importName: 'DynamicPluginsInfoContent',
              config: {
                path: 'installed',
                title: 'Installed',
              },
            },
          ],
          menuItems: {
            admin: {
              title: 'Administration',
              icon: 'adminIcon',
            },
            extensions: {
              parent: 'admin',
              title: 'Extensions',
              icon: 'pluginsInfoIcon',
            },
            rbac:{
              parent: 'admin',
              title: 'RBAC',
              icon: 'rbacIcon',
            }
          },
        },
      },
    },
  },
};

// The map of static plugins by package name
const staticPlugins: StaticPlugins = {
  'internal.plugin-dynamic-plugins-info': {
    plugin: dynamicPluginsInfoPlugin,
    module: dynamicPluginsInfoPluginModule,
  },
};

const AppRoot = () => (
  <>
    <GlobalStyles styles={{ html: { overflowY: 'hidden' } }} />
    <ScalprumRoot
      apis={apis}
      afterInit={() => import('./components/AppBase')}
      baseFrontendConfig={baseFrontendConfig}
      plugins={staticPlugins}
    />
  </>
);

export default AppRoot;

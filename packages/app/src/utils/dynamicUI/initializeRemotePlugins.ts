/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app
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

import { AppsConfig, processManifest } from '@scalprum/core';
import { ScalprumState } from '@scalprum/react-core';

import { RemotePlugins } from '../../components/DynamicRoot/DynamicRoot';

// See packages/app/src/App.tsx
const ignoreStaticPlugins = [
  'default.main-menu-items',
  'internal.plugin-dynamic-plugins-info',
];

const initializeRemotePlugins = async (
  pluginStore: ScalprumState['pluginStore'],
  scalprumConfig: AppsConfig,
  requiredModules: { scope: string; module: string }[],
): Promise<RemotePlugins> => {
  await Promise.allSettled(
    requiredModules.map(({ scope, module }) =>
      processManifest(scalprumConfig[scope]?.manifestLocation!, scope, module),
    ),
  );
  let remotePlugins = await Promise.all(
    requiredModules
      .filter(({ scope }) => !ignoreStaticPlugins.includes(scope))
      .map(({ scope, module }) =>
        pluginStore
          .getExposedModule<{
            [importName: string]: React.ComponentType<{}>;
          }>(scope, module)
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(`Failed to load plugin ${scope}`, error);
            return undefined;
          })
          .then(remoteModule => ({
            module,
            scope,
            remoteModule,
          })),
      ),
  );
  // remove all remote modules that are undefined
  remotePlugins = remotePlugins.filter(({ remoteModule }) =>
    Boolean(remoteModule),
  );
  const scopedRegistry = remotePlugins.reduce<RemotePlugins>((acc, curr) => {
    if (!curr.remoteModule) return acc;
    if (!acc[curr.scope]) {
      acc[curr.scope] = {};
    }
    if (!acc[curr.scope][curr.module]) {
      acc[curr.scope][curr.module] = {};
    }

    acc[curr.scope][curr.module] = curr.remoteModule;
    return acc;
  }, {});
  return scopedRegistry;
};

export default initializeRemotePlugins;

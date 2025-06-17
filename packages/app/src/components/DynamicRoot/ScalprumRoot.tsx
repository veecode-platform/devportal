/* eslint-disable @typescript-eslint/no-shadow */
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

import useAsync from 'react-use/lib/useAsync';

import { AppConfig } from '@backstage/config';
import { ConfigReader, defaultConfigLoader } from '@backstage/core-app-api';
import { AnyApiFactory } from '@backstage/core-plugin-api';

import { DynamicRootConfig } from '@red-hat-developer-hub/plugin-utils';
import { AppsConfig } from '@scalprum/core';
import { ScalprumProvider } from '@scalprum/react-core';

import { DynamicPluginConfig } from '../../utils/dynamicUI/extractDynamicConfig';
import overrideBaseUrlConfigs from '../../utils/dynamicUI/overrideBaseUrlConfigs';
import { DynamicRoot, StaticPlugins } from './DynamicRoot';
import Loader from './Loader';

export type ScalprumApiHolder = {
  dynamicRootConfig: DynamicRootConfig;
};

const ScalprumRoot = ({
  apis,
  afterInit,
  baseFrontendConfig,
  plugins,
}: {
  // Static APIs
  apis: AnyApiFactory[];
  afterInit: () => Promise<{ default: React.ComponentType }>;
  baseFrontendConfig?: AppConfig;
  plugins?: StaticPlugins;
}) => {
  const { loading, value } = useAsync(
    async (): Promise<{
      dynamicPlugins: DynamicPluginConfig;
      baseUrl: string;
      scalprumConfig?: AppsConfig;
    }> => {
      const appConfig = overrideBaseUrlConfigs(await defaultConfigLoader());
      const reader = ConfigReader.fromConfigs([
        baseFrontendConfig ?? { context: '', data: {} },
        ...appConfig,
      ]);
      const baseUrl = reader.getString('backend.baseUrl');
      const dynamicPlugins = reader.get<DynamicPluginConfig>('dynamicPlugins');
      try {
        const scalprumConfig: AppsConfig = await fetch(
          `${baseUrl}/api/scalprum/plugins`,
        ).then(r => r.json());
        return {
          dynamicPlugins,
          baseUrl,
          scalprumConfig,
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `Failed to fetch scalprum configuration: ${JSON.stringify(err)}`,
        );
        return {
          dynamicPlugins,
          baseUrl,
          scalprumConfig: {},
        };
      }
    },
  );
  if (loading && !value) {
    return <Loader />;
  }
  const { dynamicPlugins, baseUrl, scalprumConfig } = value || {};
  const scalprumApiHolder = {
    dynamicRootConfig: {
      dynamicRoutes: [],
      menuItems: [],
      entityTabOverrides: {},
      mountPoints: {},
      scaffolderFieldExtensions: [],
      techdocsAddons: [],
      providerSettings: [],
    } as DynamicRootConfig,
  };
  return (
    <ScalprumProvider<ScalprumApiHolder>
      api={scalprumApiHolder}
      config={scalprumConfig ?? {}}
      pluginSDKOptions={{
        pluginLoaderOptions: {
          transformPluginManifest: manifest => {
            return {
              ...manifest,
              loadScripts: manifest.loadScripts.map(
                (script: string) =>
                  `${baseUrl ?? ''}/api/scalprum/${manifest.name}/${script}`,
              ),
            };
          },
        },
      }}
    >
      <DynamicRoot
        afterInit={afterInit}
        apis={apis}
        dynamicPlugins={dynamicPlugins ?? {}}
        staticPluginStore={plugins}
        scalprumConfig={scalprumConfig ?? {}}
      />
    </ScalprumProvider>
  );
};

export default ScalprumRoot;

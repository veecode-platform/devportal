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

import { AppRouteBinder } from '@backstage/core-app-api';
import { BackstagePlugin } from '@backstage/core-plugin-api';
import { apiDocsPlugin } from '@backstage/plugin-api-docs';
import { catalogPlugin } from '@backstage/plugin-catalog';
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { orgPlugin } from '@backstage/plugin-org';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

import { RouteBinding } from '@red-hat-developer-hub/plugin-utils';
import get from 'lodash/get';

const bindAppRoutes = (
  bind: AppRouteBinder,
  routeBindingTargets: { [key: string]: BackstagePlugin<{}> },
  routeBindings: RouteBinding[],
) => {
  // Static bindings
  bind(catalogPlugin.externalRoutes, {
    createComponent: scaffolderPlugin.routes.root,
    createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
  });
  bind(apiDocsPlugin.externalRoutes, {
    registerApi: catalogImportPlugin.routes.importPage,
  });
  bind(scaffolderPlugin.externalRoutes, {
    registerComponent: catalogImportPlugin.routes.importPage,
  });
  bind(orgPlugin.externalRoutes, {
    catalogIndex: catalogPlugin.routes.catalogIndex,
  });

  const availableBindPlugins = {
    ...routeBindingTargets,
    catalogPlugin,
    catalogImportPlugin,
    scaffolderPlugin,
  };

  // binds from remote
  routeBindings.forEach(({ bindTarget, bindMap }) => {
    const externalRoutes = get(availableBindPlugins, bindTarget);
    const targetRoutes = Object.entries(bindMap).reduce<{ [key: string]: any }>(
      (acc, [key, value]) => {
        acc[key] = get(availableBindPlugins, value);
        return acc;
      },
      {},
    ) as any;
    if (
      externalRoutes &&
      Object.keys(externalRoutes).length > 0 &&
      Object.keys(targetRoutes).length > 0
    ) {
      bind(externalRoutes, targetRoutes);
    }
  });
};

export default bindAppRoutes;

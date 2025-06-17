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

import React, { useContext } from 'react';
import { Route } from 'react-router-dom';

import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  TableColumn,
} from '@backstage/core-components';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  CatalogTable,
  CatalogTableColumnsFunc,
  CatalogTableRow,
} from '@backstage/plugin-catalog';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { CatalogUnprocessedEntitiesPage } from '@backstage/plugin-catalog-unprocessed-entities';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import {
  ScaffolderFieldExtensions,
  ScaffolderLayouts,
} from '@backstage/plugin-scaffolder-react';
import { SearchPage as BackstageSearchPage } from '@backstage/plugin-search';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  // techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';

import { SupportPage } from '@internal/backstage-plugin-support';
import { AboutPage } from '@internal/plugin-about';
import DynamicRootContext from '@red-hat-developer-hub/plugin-utils';
import { ClusterExplorerPage } from '@veecode-platform/backstage-plugin-cluster-explorer';
import { VulnerabilitiesPage } from '@veecode-platform/backstage-plugin-vulnerabilities';
import { DatabaseExplorerPage } from '@veecode-platform/plugin-database-explorer';
import { EnvironmentExplorerPage } from '@veecode-platform/plugin-environment-explorer';
import { VaultExplorerPage } from '@veecode-platform/plugin-vault-explorer';
import {
  RepoUrlSelectorExtension,
  ResourcePickerExtension,
  UploadFilePickerExtension,
} from '@veecode-platform/veecode-scaffolder-extensions';

import getDynamicRootConfig from '../../utils/dynamicUI/getDynamicRootConfig';
import { entityPage } from '../catalog/EntityPage';
import { ExplorePage } from '../Explorer/ExplorerPage';
import { Root } from '../Root';
import { ApplicationListener } from '../Root/ApplicationListener';
import { ApplicationProvider } from '../Root/ApplicationProvider';
import ConfigUpdater from '../Root/ConfigUpdater';
import { LayoutCustom } from '../scaffolder/LayoutCustom';
import { SearchPage } from '../search/SearchPage';
import { settingsPage } from '../UserSettings/SettingsPages';

const createApiDocsCustomColumns = (): TableColumn<CatalogTableRow>[] => {
  const nameColumn = CatalogTable.columns.createNameColumn({
    defaultKind: 'API',
  });
  const ownerColumn = CatalogTable.columns.createOwnerColumn();
  const specTypeColumn = CatalogTable.columns.createSpecTypeColumn();
  const specLifecyclecColumn = CatalogTable.columns.createSpecLifecycleColumn();
  const publishedAtColumn = {
    title: 'Published At',
    field: 'entity.metadata.publishedAt',
    width: 'auto',
  };
  const tagsColumn = CatalogTable.columns.createTagsColumn();

  nameColumn.width = 'auto';
  ownerColumn.width = 'auto';
  specTypeColumn.width = 'auto';
  specLifecyclecColumn.width = 'auto';
  tagsColumn.width = 'auto';
  tagsColumn.cellStyle = {
    padding: '.8em .5em',
  };

  return [
    nameColumn,
    ownerColumn,
    specTypeColumn,
    specLifecyclecColumn,
    publishedAtColumn,
    tagsColumn,
  ];
};

const AppBase = () => {
  const {
    AppProvider,
    AppRouter,
    dynamicRoutes,
    entityTabOverrides,
    providerSettings,
    scaffolderFieldExtensions,
  } = useContext(DynamicRootContext);

  const myCustomColumnsFunc: CatalogTableColumnsFunc = entityListContext => [
    ...CatalogTable.defaultColumnsFunc(entityListContext),
    {
      title: 'Created At',
      customSort: (a: CatalogTableRow, b: CatalogTableRow): any => {
        const timestampA =
          a.entity.metadata.annotations?.['backstage.io/createdAt'];
        const timestampB =
          b.entity.metadata.annotations?.['backstage.io/createdAt'];

        const dateA =
          timestampA && timestampA !== ''
            ? new Date(timestampA).toISOString()
            : '';
        const dateB =
          timestampB && timestampB !== ''
            ? new Date(timestampB).toISOString()
            : '';

        return dateA.localeCompare(dateB);
      },
      render: (data: CatalogTableRow) => {
        const date =
          data.entity.metadata.annotations?.['backstage.io/createdAt'];
        return !isNaN(new Date(date || '') as any)
          ? data.entity.metadata.annotations?.['backstage.io/createdAt']
          : '';
      },
    },
  ];

  return (
    <AppProvider>
      <AlertDisplay />
      <OAuthRequestDialog />
      <ConfigUpdater />
      <AppRouter>
        <ApplicationListener />
        <Root>
          <ApplicationProvider>
            <FlatRoutes>
              <Route
                path="/catalog"
                element={
                  <CatalogIndexPage pagination columns={myCustomColumnsFunc} />
                }
              />
              <Route path="/explore" element={<ExplorePage />} />
              <Route
                path="/catalog/:namespace/:kind/:name"
                element={<CatalogEntityPage />}
              >
                {entityPage(entityTabOverrides)}
              </Route>
              <Route
                path="/create"
                element={
                  <ScaffolderPage headerOptions={{ title: 'Self-service' }} />
                }
              >
                <ScaffolderLayouts>
                  <ScaffolderFieldExtensions>
                    <LayoutCustom />
                    {scaffolderFieldExtensions.map(
                      ({ scope, module, importName, Component }) => (
                        <Component key={`${scope}-${module}-${importName}`} />
                      ),
                    )}
                    <RepoUrlSelectorExtension />
                    <ResourcePickerExtension />
                    <UploadFilePickerExtension />
                  </ScaffolderFieldExtensions>
                </ScaffolderLayouts>
              </Route>
              <Route
                path="/api-docs"
                element={
                  <ApiExplorerPage
                    columns={createApiDocsCustomColumns()}
                    pagination={{
                      mode: 'offset',
                      limit: 15,
                    }}
                  />
                }
              />
              <Route path="/docs" element={<TechDocsIndexPage />}>
                <DefaultTechDocsHome />
              </Route>
              <Route
                path="/docs/:namespace/:kind/:name/*"
                element={<TechDocsReaderPage />}
              />
              <Route
                path="/catalog-import"
                element={
                  <RequirePermission permission={catalogEntityCreatePermission}>
                    <CatalogImportPage />
                  </RequirePermission>
                }
              />
              <Route path="/search" element={<BackstageSearchPage />}>
                <SearchPage />
              </Route>
              <Route
                path="/cluster-explorer"
                element={<ClusterExplorerPage />}
              />
              <Route
                path="/environments-explorer"
                element={<EnvironmentExplorerPage />}
              />
              <Route
                path="/database-explorer"
                element={<DatabaseExplorerPage />}
              />
              <Route path="/vault-explorer" element={<VaultExplorerPage />} />
              <Route path="/settings" element={<UserSettingsPage />}>
                {settingsPage(providerSettings)}
              </Route>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route
                path="/catalog-unprocessed-entities"
                element={<CatalogUnprocessedEntitiesPage />}
              />
              ;
              <Route
                path="/vulnerabilities"
                element={<VulnerabilitiesPage />}
              />
              <Route
                path="/catalog-graph"
                element={
                  <CatalogGraphPage
                    initialState={{
                      selectedKinds: [
                        'component',
                        'domain',
                        'system',
                        'api',
                        'group',
                        'cluster',
                        'environment',
                        'database',
                        'vault',
                      ],
                      selectedRelations: [
                        RELATION_OWNER_OF,
                        RELATION_OWNED_BY,
                        RELATION_CONSUMES_API,
                        RELATION_API_CONSUMED_BY,
                        RELATION_PROVIDES_API,
                        RELATION_API_PROVIDED_BY,
                        RELATION_HAS_PART,
                        RELATION_PART_OF,
                        RELATION_DEPENDS_ON,
                        RELATION_DEPENDENCY_OF,
                      ],
                    }}
                  />
                }
              />
              {dynamicRoutes.map(
                ({ Component, staticJSXContent, path, config: { props } }) => {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={<Component {...props} />}
                    >
                      {typeof staticJSXContent === 'function'
                        ? staticJSXContent(getDynamicRootConfig())
                        : staticJSXContent}
                    </Route>
                  );
                },
              )}
            </FlatRoutes>
          </ApplicationProvider>
        </Root>
      </AppRouter>
    </AppProvider>
  );
};

export default AppBase;

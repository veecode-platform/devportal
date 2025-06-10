/* eslint-disable import/no-extraneous-dependencies */
import React, { ReactNode } from 'react';
import { Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
  CatalogTable,
  CatalogTableColumnsFunc,
  CatalogTableRow,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
  DefaultTechDocsHome,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import {
  AlertDisplay,
  OAuthRequestDialog,
  TableColumn,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import {
  AppRouter,
  FlatRoutes,
  SignInPageProps,
} from '@backstage/core-app-api';
// custom
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import '../src/components/theme/theme.css';
import { searchPage } from './components/search/SearchPage';
import {
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
} from '@backstage/catalog-model';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { ExplorePage } from './components/explorer/ExplorerPage';
import { UnifiedThemeProvider } from '@backstage/theme';
import useAsync from 'react-use/lib/useAsync';
import { makeLightTheme, makeDarkTheme } from './components/theme/Theme';
import { ClusterExplorerPage } from '@veecode-platform/backstage-plugin-cluster-explorer';
import { EnvironmentExplorerPage } from '@veecode-platform/plugin-environment-explorer';
import { DatabaseExplorerPage } from '@veecode-platform/plugin-database-explorer';
import { AboutPage } from '@internal/plugin-about';
import type { IdentityApi } from '@backstage/core-plugin-api';
import { VisitListener } from '@backstage/plugin-home';
import { VaultExplorerPage } from '@veecode-platform/plugin-vault-explorer';
// import { SignInPage as VeecodeSignInPage } from './components/SignInPage';
// import { SignInPage } from '@backstage/core-components';
import {
  ScaffolderFieldExtensions,
  ScaffolderLayouts,
} from '@backstage/plugin-scaffolder-react';
import {
  RepoUrlSelectorExtension,
  ResourcePickerExtension,
  UploadFilePickerExtension,
} from '@veecode-platform/veecode-scaffolder-extensions';
import { SupportPage } from '@internal/backstage-plugin-support';
import { AppProvider } from './context';
import { RbacPage } from '@backstage-community/plugin-rbac';
import { LayoutCustom } from './components/scaffolder/LayoutCustom';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  keycloakProvider,
  githubProvider,
  gitlabProvider,
} from './identityProviders';
import { CatalogUnprocessedEntitiesPage } from '@backstage/plugin-catalog-unprocessed-entities';
import { VeeCodeSignInPage } from './components/SignInPage/VeeCodeSigninPage';

const SignInComponent: any = (props: SignInPageProps) => {
  const config = useApi(configApiRef);
  const guest = config.getBoolean('platform.guest.enabled');
  const signInProviders = config.getStringArray('platform.signInProviders');
  const demoGuest = config.getOptionalBoolean('platform.guest.demo');
  const providers: Array<typeof githubProvider | typeof keycloakProvider | typeof gitlabProvider> = []
  if(signInProviders && signInProviders.length > 0) {
    signInProviders.forEach(provider => {
      if (provider === 'keycloak') {
        providers.push(keycloakProvider);
      } else if (provider === 'github') {
        providers.push(githubProvider);
      } else if (provider === 'gitlab') {
        providers.push(gitlabProvider);
      }
    });
  }
  
  return (
    <VeeCodeSignInPage
      providers={
        guest ? (demoGuest ? [...providers, 'guest'] : ['guest']) : providers
      }
      onSignInSuccess={async (identityApi: IdentityApi) => {
        props.onSignInSuccess(identityApi);
      }}
    />
  );
};

const ThemeComponent = ({
  children,
  light,
}: {
  children: ReactNode;
  light?: boolean;
}) => {
  const { value, loading } = useAsync(async (): Promise<any> => {
    try {
      const res = await fetch('theme.json');
      const parsedJsonTheme = await res.json();
      return parsedJsonTheme;
    } catch (_e) {
      return {};
    }
  }, []);
  if (loading) return null;
  const theme = light ? makeLightTheme(value.light) : makeDarkTheme(value.dark);
  return <UnifiedThemeProvider theme={theme} children={children} />;
};

const customColumns: CatalogTableColumnsFunc = entityListContext => {
  const nameColumn = CatalogTable.columns.createNameColumn();
  const ownerColumn = CatalogTable.columns.createOwnerColumn();
  const typeColumn = CatalogTable.columns.createSpecTypeColumn();
  const lifecycleColumn = CatalogTable.columns.createSpecLifecycleColumn();
  const descriptionColumn =
    CatalogTable.columns.createMetadataDescriptionColumn();
  const tagsColumn = CatalogTable.columns.createTagsColumn();

  nameColumn.width = 'auto';
  typeColumn.width = 'auto';
  ownerColumn.width = 'auto';
  lifecycleColumn.width = 'auto';
  descriptionColumn.width = 'auto';
  tagsColumn.width = 'auto';

  if (entityListContext.filters.kind?.value !== 'Api') {
    return [
      nameColumn,
      ownerColumn,
      typeColumn,
      lifecycleColumn,
      descriptionColumn,
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};

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

const app = createApp({
  apis,
  components: {
    SignInPage: SignInComponent,
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      // viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  themes: [
    {
      id: 'Light',
      title: 'Light Mode',
      variant: 'light',
      icon: <Brightness7Icon />,
      Provider: ({ children }) => <ThemeComponent children={children} light />,
      // Provider: ({ children }) => (<UnifiedThemeProvider theme={devportalThemes.light} children={children} />),
    },
    {
      id: 'Dark',
      title: 'Dark Mode',
      variant: 'dark',
      icon: <Brightness4Icon />,
      Provider: ({ children }) => <ThemeComponent children={children} />,
      // Provider: ({ children }) => (<UnifiedThemeProvider theme={devportalThemes.dark} children={children} />),
    },
  ],
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/explore" element={<ExplorePage />} />
    <Route
      path="/catalog"
      element={
        <CatalogIndexPage
          columns={customColumns}
          pagination={{
            mode: 'offset',
            limit: 15,
          }}
          /*desabilitado apos versao 1.35, erro - corrigir
      filters={
        <>
          <defaultfilters
            initialkind="component"
            initiallyselectedfilter="all"
            ownerpickermode="all"
          />
        </>
      }*/
        />
      }
    />
    <Route path="/catalog-import" element={<CatalogImportPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
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
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
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
    <Route path="/cluster-explorer" element={<ClusterExplorerPage />} />
    <Route
      path="/environments-explorer"
      element={<EnvironmentExplorerPage />}
    />
    <Route path="/database-explorer" element={<DatabaseExplorerPage />} />
    <Route path="/vault-explorer" element={<VaultExplorerPage />} />
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderLayouts>
        <ScaffolderFieldExtensions>
          <LayoutCustom />
          <RepoUrlSelectorExtension />
          <ResourcePickerExtension />
          <UploadFilePickerExtension />
        </ScaffolderFieldExtensions>
      </ScaffolderLayouts>
    </Route>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/rbac" element={<RbacPage />} />;
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/support" element={<SupportPage />} />
    <Route
      path="/catalog-unprocessed-entities"
      element={<CatalogUnprocessedEntitiesPage />}
    />
    ;
  </FlatRoutes>
);

export default app.createRoot(
  <AppProvider>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>,
);

/* eslint-disable import/no-extraneous-dependencies */
import React, { ReactNode } from 'react';
import {
  // Navigate,
  // Outlet,
  Route,
} from 'react-router';
import {
  apiDocsPlugin,
  ApiExplorerPage
} from '@veecode-platform/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@veecode-platform/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import {
  ScaffolderPage,
  scaffolderPlugin,
} from '@veecode-platform/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
  DefaultTechDocsHome
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@veecode-platform/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import {
  AlertDisplay,
  OAuthRequestDialog
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes, SignInPageProps } from '@backstage/core-app-api';
// custom
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import '../src/components/theme/theme.css';
import { searchPage } from './components/search/SearchPage';
import { ServicesPage, PartnersPage, ApplicationPage } from '@internal/plugin-application';
import { providers } from './identityProviders';
import { RELATION_OWNER_OF, RELATION_OWNED_BY, RELATION_CONSUMES_API, RELATION_API_CONSUMED_BY, RELATION_PROVIDES_API, RELATION_API_PROVIDED_BY, RELATION_HAS_PART, RELATION_PART_OF, RELATION_DEPENDS_ON, RELATION_DEPENDENCY_OF } from '@backstage/catalog-model';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { UserIdentity } from '@backstage/core-components';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { apiManagementEnabledPermission } from '@internal/plugin-application-common';
import { ExplorePage } from './components/explorer/ExplorerPage';
import { configApiRef, discoveryApiRef, useApi } from "@backstage/core-plugin-api";
import { SignInPage } from '@veecode-platform/core-components';
import { UnifiedThemeProvider } from '@backstage/theme';
import useAsync from 'react-use/lib/useAsync';
import { makeLightTheme, makeDarkTheme } from './components/theme/Theme';
import { ClusterExplorerPage } from '@veecode-platform/backstage-plugin-cluster-explorer';
import { EnvironmentExplorerPage } from '@veecode-platform/plugin-environment-explorer';
import { DatabaseExplorerPage } from '@veecode-platform/plugin-database-explorer';
import { AboutPage } from '@internal/plugin-about';
import type { IdentityApi } from '@backstage/core-plugin-api';
import { setTokenCookie } from './cookieAuth';
import { VisitListener } from '@backstage/plugin-home';

const SignInComponent: any = (props: SignInPageProps) => {
  const config = useApi(configApiRef);
  const guest = config.getBoolean("platform.guest.enabled");
  if (guest) props.onSignInSuccess(UserIdentity.createGuest());
  const discoveryApi = useApi(discoveryApiRef);
  return (<SignInPage
    {...props}
    provider={providers[1]}
    onSignInSuccess={async (identityApi: IdentityApi) => {
      setTokenCookie(
        await discoveryApi.getBaseUrl('cookie'), 
        identityApi,
      );
      props.onSignInSuccess(identityApi);
    }}

  />)
};

const ThemeComponent = ({ children, light }: { children: ReactNode, light?: boolean }) => {
  const { value, loading } = useAsync(async (): Promise<any> => {
    try {
      const res = await fetch('theme.json')
      const parsedJsonTheme = await res.json()
      return parsedJsonTheme
    }
    catch (_e) {
      return {}
    }
  }, [])
  if (loading) return null
  const theme = light ? makeLightTheme(value.light) : makeDarkTheme(value.dark)
  return <UnifiedThemeProvider theme={theme} children={children} />
}

const app = createApp({
  apis,
  components: {
    SignInPage: SignInComponent
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
      viewTechDoc: techdocsPlugin.routes.docRoot,
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
      Provider: ({ children }) => (<ThemeComponent children={children} light />)
      // Provider: ({ children }) => (<UnifiedThemeProvider theme={devportalThemes.light} children={children} />),
    },
    {
      id: 'Dark',
      title: 'Dark Mode',
      variant: 'dark',
      icon: <Brightness4Icon />,
      Provider: ({ children }) => (<ThemeComponent children={children} />)
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
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route path="/catalog-import" element={<CatalogImportPage />} />
    <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
      {entityPage}
    </Route>
    <Route
      path="/catalog-graph"
      element={
        <CatalogGraphPage
          initialState={{
            selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
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
    <Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/cluster-explorer" element={<ClusterExplorerPage/>}/> 
    <Route path="/environments-explorer" element={<EnvironmentExplorerPage />}/>
    <Route path="/database-explorer" element={<DatabaseExplorerPage/>}/>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/services"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <ServicesPage />
        </RequirePermission>
      }
    />
    <Route path="/partners"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <PartnersPage />
        </RequirePermission>
      }
    />
    <Route path="/applications"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <ApplicationPage />
        </RequirePermission>
      }
    />
    <Route path="/about" element={<AboutPage />} />
  </FlatRoutes>
);


export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>
        {routes}
      </Root>
    </AppRouter>
  </>,
);

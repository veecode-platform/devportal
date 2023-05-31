/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  // Navigate,
  // Outlet,
  Route,
} from 'react-router';
import {
  apiDocsPlugin,
  ApiExplorerPage
} from '@internal/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@internal/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import {
  ScaffolderPage,
  scaffolderPlugin,
} from '@internal/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
  DefaultTechDocsHome
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@internal/plugin-user-settings-platform';
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
import { HomepageCompositionRoot } from '@internal/plugin-home-platform';
import { HomePage } from './components/home/HomePage';
import { Light, Dark } from './components/theme/Theme';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import '../src/components/theme/theme.css';
import { searchPage } from './components/search/SearchPage';
import { ServicesPage, PartnersPage, ApplicationPage } from '@internal/plugin-application';
import { providers } from './identityProviders';
import { RELATION_OWNER_OF, RELATION_OWNED_BY, RELATION_CONSUMES_API, RELATION_API_CONSUMED_BY, RELATION_PROVIDES_API, RELATION_API_PROVIDED_BY, RELATION_HAS_PART, RELATION_PART_OF, RELATION_DEPENDS_ON, RELATION_DEPENDENCY_OF } from '@backstage/catalog-model';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { SignInPage } from '@internal/plugin-sign-in/src/components/SignInPage';
import { useGuest } from './Hooks/useGuest';
import { GuestUserIdentity } from '@internal/plugin-sign-in/src/components/providers/guestUserIdentity';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { apiManagementEnabledPermission } from '@internal/plugin-application-common';

const SignInComponent: any = (props: SignInPageProps) => {
  const Guest = useGuest();
    if(Guest) props.onSignInSuccess(new GuestUserIdentity());
    return <SignInPage {...props} providers={[providers[1]]} />
};

const app = createApp({
  apis,
  components: {
    SignInPage: SignInComponent
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
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
      Provider: ({ children }) => (
        <ThemeProvider theme={Light}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'Dark',
      title: 'Dark Mode',
      variant: 'dark',
      icon: <Brightness4Icon />,
      Provider: ({ children }) => (
        <ThemeProvider theme={Dark}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ],
});


const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route path="/catalog-import" element={<CatalogImportPage />}/>
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
    <Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}/>
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/services"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <ServicesPage/>
        </RequirePermission>
      }
    />
    <Route path="/partners"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <PartnersPage/>
        </RequirePermission>
      }
    />
    <Route path="/applications"
      element={
        <RequirePermission permission={apiManagementEnabledPermission}>
          <ApplicationPage/>
        </RequirePermission>
      }
    /> 
  </FlatRoutes>
);


export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        {routes}
      </Root>
    </AppRouter>
  </>,
);

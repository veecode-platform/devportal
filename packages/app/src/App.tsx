import React from 'react';
import { 
  // Navigate, 
  Route
 } from 'react-router';
import { 
   apiDocsPlugin,
  //  ApiExplorerPage  // change for custom page
  } from '@backstage/plugin-api-docs';

  // custom page - API explorer
  import { ApiExplorerPage } from './components/api-docs/apiExplorerPage/ApiExplorerPage';

import {
  CatalogEntityPage,
  // CatalogIndexPage, // change for custom page
  catalogPlugin,
} from '@backstage/plugin-catalog';
// custom page - catalog
import { CatalogPage as CatalogIndexPage } from './components/catalog/catalogPage';

import {
  // CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { 
  // ScaffolderPage, 
  scaffolderPlugin
 } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
// import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  // TechDocsIndexPage,
  techdocsPlugin,
  // TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
// import { UserSettingsPage } from '@backstage/plugin-user-settings';
// custom user-settings
import { UserSettingsPage } from './components/user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog, SignInPage } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
// import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
// import { PermissionedRoute } from '@backstage/plugin-permission-react';
// import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';


// custom
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import {Light, Dark } from './components/theme/Theme';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';


import { searchPage } from './components/search/SearchPage';
// import SafeRoute from './components/Routing/SafeRoute';
import { ServicesPage, PartnersPage} from '@internal/plugin-application';
// login
import { providers } from './identityProviders';
/* import { RequirePermission } from '@backstage/plugin-permission-react';
import { adminAccessPermission } from '@internal/plugin-application-common';*/

const app = createApp({
  apis,
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={[...providers]}
        />
      );
    },
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
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  themes: [{
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
     icon: <Brightness4Icon/>,
     Provider: ({ children }) => (
     <ThemeProvider theme={Dark}>
      <CssBaseline>{children}</CssBaseline>
     </ThemeProvider>
  ),
}]
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();


const routes = (
  <FlatRoutes>
    
    <Route path="/" element={<HomepageCompositionRoot />}>
     <HomePage />
    </Route>

    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    
    {/* <Route path="/services" element={<SafeRoute allow={["admin"]}/>}>
      <Route 
        path="/services" 
        element={<ServicesPage />} 
      />
    </Route>*/}

    {// not working following docs
    /* <Route path='/services' element={
      <RequirePermission permission={adminAccessPermission}>
        <ServicesPage />
      </RequirePermission>
    }/> */
    }
    <Route path="/services" element={<ServicesPage />}/>
    <Route path="/partners" element={<PartnersPage />}/>

  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;


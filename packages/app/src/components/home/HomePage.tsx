// import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  Content,
  Page
} from '@backstage/core-components';
import {
  // starredEntitiesApiRef,
  MockStarredEntitiesApi,
  // entityRouteRef,
} from '@backstage/plugin-catalog-react';
// import { configApiRef } from '@backstage/core-plugin-api';
// import { ConfigReader } from '@backstage/config';
import { HomePageSearchBar, /*searchPlugin*/ } from '@backstage/plugin-search'; 
import {
  //searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
// custom
import { Logo } from '../plataformLogo/plataformLogo';
import BackstageLogo from "../../assets/backstage.png";
import { HomePageStarredEntities,  HomePageCompanyLogo } from '@internal/plugin-home-platform';
import {
  HomePageToolkit,
  // HomePageTopVisited,
  // HomePageRecentlyVisited
} from '@backstage/plugin-home';
import Icon from './Icon'
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const starredEntitiesApi = new MockStarredEntitiesApi();
starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');

export default {
  title: 'Plugins/Home/Templates',
  /*decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
              [starredEntitiesApiRef, starredEntitiesApi],
              [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
              [
                configApiRef,
                new ConfigReader({
                  stackoverflow: {
                    baseUrl: 'https://api.stackexchange.com/2.2',
                  },
                }),
              ],
            ]}
          >
            <Story />
          </TestApiProvider>
        </>,
        {
          mountedRoutes: {
            '/hello-company': searchPlugin.routes.root,
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],*/
};

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    width: '80vw',
    maxWidth: '700px',
    backgroundColor: theme.palette.background.paper,
    backgroundAttachment: 'fixed',
    boxShadow: theme.shadows[1],
    borderRadius: '5px',
    outline: 'none',
    border: 'none',
    margin: '10px auto',
    '&:hover':{
      outline: 'none',
      borderColor: 'transparent',
    },
    '&:focus':{
      outline: 'none',
      border: 'transparent',
    }
  },
  container: {
    margin: theme.spacing(5, 0),
  },
  width: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0px',
  },
  starredContent:{
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: '15px'
  }
  ,
  footerWrapper:{
    marginTop: '9rem',    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold'
  }
  ,
  logoBackstage: {
    width: '7.5em',
    height: '1.5em'
  },
  footer:{
    display:'flex',
    alignItems:'center',
    justifyContent: 'center',
    fontSize: '1.3em',
    gap: '10px'
  }

}));



export const HomePage = () => {
  
  const classes = useStyles();
  const config = useApi(configApiRef);
  const logoIconSrc = config.getOptionalString("platform.logo.icon") ?? "https://platform.vee.codes/apple-touch-icon.png"

  const tools = [
    {
      url: 'https://docs.platform.vee.codes/',
      label: 'Docs',
      icon: <Icon src={logoIconSrc}/>,
    },
    {
      url: 'https://github.com/orgs/veecode-platform/discussions',
      label: 'Community',
      icon: <Icon src={logoIconSrc}/>,
    },
    {
      url: 'https://platform.vee.codes/',
      label: 'Website',
      icon: <Icon src={logoIconSrc}/>,
    },
    {
      url: 'https://veecode-suporte.freshdesk.com/support/login',
      label: 'Support',
      icon: <Icon src={logoIconSrc}/>,
    }
  ];

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={classes.width} logo={<Logo />} />
            <Grid container item xs={12} alignItems="center" direction="row">
              <HomePageSearchBar
                classes={{ root: classes.searchBar }}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              {/* <Grid container item xs={12}>
                <Grid item xs={12} md={6}>
                  <HomePageTopVisited kind="recent"/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <HomePageRecentlyVisited />
                </Grid>
              </Grid> */}

              <Grid container item xs={12}>
              <Grid item xl={8} lg={12} md={12} xs={12}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xl={4} lg={12} md={12} xs={12}>
                <HomePageToolkit tools={tools} />
              </Grid>
            </Grid>
            </Grid>
            <Grid item className={classes.footerWrapper} lg={12}>
              <p className={classes.footer}>
                {' '}
                <span className={classes.footerText}>Powered by </span>{' '}
                <img
                  src={BackstageLogo}
                  alt="backstage logo"
                  className={classes.logoBackstage}
                />{' '}
              </p>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};

import {
  // HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
} from '@backstage/plugin-home';

import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { 
          Content,
           Page, 
          //  InfoCard 
  } from '@backstage/core-components';
import {
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { HomePageSearchBar, searchPlugin } from '@backstage/plugin-search';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
// import { HomePageStackOverflowQuestions } from '@backstage/plugin-stack-overflow';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType } from 'react';

// custom
import {
           Logo , 
          //  Icon 
          } from '../ipaasLogo/IpaasLogo';




const starredEntitiesApi = new MockStarredEntitiesApi();
starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');

export default {
  title: 'Plugins/Home/Templates',
  decorators: [
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
  ],
};

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    width: '80vw',
    maxWidth: '700px',
    backgroundColor: theme.palette.background.paper,
    backgroundAttachment: 'fixed',
    boxShadow: theme.shadows[1],
    padding: '10px 0',
    borderRadius: '30px',
    outline: 'none',
    border: 'mone',
    margin: '10px auto',
  },
  container: {
    margin: theme.spacing(5, 0),
  },
  width:{
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0px'
  }

}));


export const HomePage = () => {
  const classes = useStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={classes.width}
              logo={<Logo/>}
            />
            <Grid container item xs={12} alignItems="center" direction="row">
              <HomePageSearchBar
                classes={{ root: classes.searchBar }}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item lg={12}>
                <HomePageStarredEntities />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <HomePageToolkit
                  tools={Array(8).fill({
                    url: '#',
                    label: 'link',
                    icon: <Icon />,
                  })}
                />
              </Grid> */}
              {/* <Grid item xs={12} md={6}>
                <InfoCard  title="Composable Section"> */}
                  {/* placeholder for content */}
                  {/* <div style={{ height: 370 }} />
                </InfoCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageStackOverflowQuestions
                  requestParams={{
                    tagged: 'backstage',
                    site: 'stackoverflow',
                    pagesize: 5,
                  }}
                />
              </Grid> */}
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};

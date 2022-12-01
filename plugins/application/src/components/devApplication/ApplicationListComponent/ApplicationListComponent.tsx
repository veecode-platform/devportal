import React from 'react';
import { Button, Grid } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import {
// InfoCard,
  Header,
  Page,
  Content,
  ContentHeader
} from '@backstage/core-components';
import { FetchListComponent } from '../FetchListComponent';

// TO DO >> Makestyles for button

export const ApplicationListComponent = () => (
  
  <Page themeId="tool">
    <Header title="Application for Partners"> </Header>
    <Content>
      <ContentHeader title=''>
        <Grid item xs={12} >
                  <Grid container justifyContent='center' alignItems='center'>
                    <Button component={RouterLink} to='/application/' style={{ margin: "5px" , background: "#20a082", color:"#fff"}} variant='contained' size='large'>Refresh</Button>
                    <Button component={RouterLink} to='/application/new-app' style={{ margin: "5px" , background: "#20a082", color:"#fff"}} variant='contained' size='large'>Create App</Button>
                  </Grid>
                </Grid>
      </ContentHeader>

      <Grid container spacing={5} direction="column">

        <Grid item xs={12}>
          <FetchListComponent />
        </Grid>
        
      </Grid>
    </Content>
  </Page>
);
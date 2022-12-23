import React from 'react';
import { Grid } from '@material-ui/core';

import {
  //InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  CreateButton 
} from '@backstage/core-components';
import { FetchComponent } from '../FetchComponent';

export const ListComponent = () => (
  
  <Page themeId="tool">
    <Header title="Services"></Header>
    <Content>
      <ContentHeader title=''>
        <CreateButton title="Create Service" to={"/services/create-service"}/>
      </ContentHeader>

      <Grid container spacing={5} direction="column">

        <Grid item xs={12}>
          <FetchComponent />
        </Grid>
        
      </Grid>
    </Content>
  </Page>
);
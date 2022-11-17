import React from 'react';
import { Grid, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Progress} from '@backstage/core-components';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';

type App = {
  id: string; 
  creator: string;
  name: string; 
  serviceName: Array<string>; 
  description: string; 
  active: boolean; 
  statusKong?: string; 
  createdAt: string; 
  updatedAt: string; 
  consumerName?: string; 
};


type Application = {
  application: App | undefined;
}

const Details = ({ application }: Application) => {
  return (
    <Page themeId="tool">
      <Header title="My Service"></Header>
  
      <Content>
        <Grid container direction='column' spacing={6}>
          <InfoCard variant="gridItem">
  
            <Grid style={{margin: "2vw"}} item xs={12}>
              <Grid container spacing={3} >
                <ContentHeader title="Details"><Button variant='contained' size='large' color='primary'>Edit</Button></ContentHeader>
                <Grid item lg={3} xs={6}>
                  <h1>App id</h1>
                  <p>{application?.id}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Created</h1>
                  <p>{application?.createdAt}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Redirect Url</h1>
                  <p>https://example.com</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Service name</h1>
                  <p>{application?.serviceName}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Description</h1>
                  <p>{application?.description}</p>
                </Grid>         
              </Grid>
            </Grid>
  
            <Grid style={{margin: "2vw"}} item xs={12} >
              <Grid container justifyContent='center' alignItems='center' spacing={2}>
                <Grid item><Button component={RouterLink} to={'/services'} variant='contained' size='large'>Cancel</Button></Grid>
              </Grid>
                
            </Grid>
  
          </InfoCard>
        </Grid>
  
      </Content>
    </Page>
  );

}



export const DetailsComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];

  const { value, loading, error } = useAsync(async (): Promise<App> => {
    const response = await fetch(`http://localhost:7007/api/application/${id}`);
    const data = await response.json();
    //console.log(data.application)
    return data.application;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details application={value}/>
  
}
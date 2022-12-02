import React from 'react';
import { Grid, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Progress} from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation, Link as RouterLink } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { IApplication } from '../interfaces';

type Application = {
  application: IApplication | undefined;
}

const Details = ({ application }: Application) => {
  return (
    <Page themeId="tool">
      <Header title={application?.name}> </Header>
  
      <Content>
        <Grid container direction='column' spacing={6}>
          <InfoCard variant="gridItem">
  
            <Grid style={{margin: "2vw"}} item xs={12}>
              <Grid container spacing={3} >
                <ContentHeader title="Details">
                  <Button
                   variant='contained' component={RouterLink}
                    to='/application/new-app' size='large'
                     color='primary'>
                      Create
                    </Button>
                </ContentHeader>
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
  
            {/* <Grid style={{margin: "2vw"}} item xs={12} >
              <Grid container spacing={3} >
                <ContentHeader title="Authentication"> </ContentHeader>
                <Grid item lg={4} xs={6}>
                  <h1>Client Id</h1>
                  <p>12312317812312</p>
                </Grid>
                <Grid item lg={4} xs={6}>
                  <h1>Secret</h1>
                  <p>***********</p>
                </Grid>
              </Grid>
            </Grid> */}
  
            <Grid style={{margin: "2vw"}} item xs={12} >
              <Grid container justifyContent='center' alignItems='center' spacing={2}>
                <Grid item><Button component={RouterLink} to='/application' variant='contained' size='large'>Cancel</Button></Grid>
              </Grid>
                
            </Grid>
  
          </InfoCard>
        </Grid>
  
      </Content>
    </Page>
  );

}



export const ApplicationDetailsComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];

  const { value, loading, error } = useAsync(async (): Promise<IApplication> => {
    const response = await fetch(`http://localhost:7007/api/application/${id}`);
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data.application)
    return data.application;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details application={value}/>
  
}
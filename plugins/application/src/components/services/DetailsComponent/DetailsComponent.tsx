import React from 'react';
import { Grid, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Progress} from '@backstage/core-components';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { PartnerListComponent } from './PartnerListComponent';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';

type Service = {
  id: string; 
  name: string; 
  description: string;
  redirectUrl: string;
  partnersId: string[];
  kongServiceName: string;
  kongServiceId: string; 
  createdAt: string; 
  updatedAt: string; 
};


type Services = {
  service: Service | undefined;
}

const Details = ({ service }: Services) => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];
  return (
    <Page themeId="tool">
      <Header title="My Service"></Header>
  
      <Content>
        <Grid container direction='column' spacing={6}>
          <InfoCard variant="gridItem">
  
            <Grid style={{margin: "2vw"}} item xs={12}>
              <Grid container spacing={3} style={{marginBottom: "6vh"}} >
                <ContentHeader title="Details"><Button variant='contained' size='large' color='primary' component={RouterLink} to={`/services/edit-service?id=${id}`}>Edit</Button></ContentHeader>
                <Grid item lg={3} xs={6}>
                  <h1>App id</h1>
                  <p>{service?.id}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Redirect Url</h1>
                  <p>{service?.redirectUrl}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Service name</h1>
                  <p>{service?.name}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Kong service name</h1>
                  <p>{service?.kongServiceName}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Description</h1>
                  <p>{service?.description}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Security</h1>
                  <p>Api key</p>
                </Grid>   
                <Grid item lg={3} xs={6}>
                  <h1>Created</h1>
                  <p>{service?.createdAt}</p>
                </Grid>      
              </Grid>
              <Grid container spacing={3} >
                <Grid item lg={12} xs={12}>
                <PartnerListComponent servicePartnerId={service?.partnersId} serviceId={service?.id}/>
                </Grid>  
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

  const { value, loading, error } = useAsync(async (): Promise<Service> => {
    const response = await fetch(`http://localhost:7007/api/application/service/${id}`);
    const data = await response.json();
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details service={value}/>
  
}
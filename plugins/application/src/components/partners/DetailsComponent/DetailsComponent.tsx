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

type Partner = {
  id: string; 
  name: string;
  applicationId: Array<string>; 
  createdAt: string; 
  updatedAt: string; 
};


type PartnerProps = {
  partner: Partner | undefined;
}

const Details = ({ partner }: PartnerProps) => {
  return (
    <Page themeId="tool">
      <Header title="Partner"></Header>
  
      <Content>
        <Grid container direction='column' spacing={6}>
          <InfoCard variant="gridItem">
  
            <Grid style={{margin: "2vw"}} item xs={12}>
              <Grid container spacing={3} >
                <ContentHeader title="Details"><Button variant='contained' size='large' color='primary'>Edit</Button></ContentHeader>
                <Grid item lg={3} xs={6}>
                  <h1>Id</h1>
                  <p>{partner?.id}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Name</h1>
                  <p>{partner?.name}</p>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <h1>Created</h1>
                  <p>{partner?.createdAt}</p>
                </Grid> 
              </Grid>
            </Grid>
  
            <Grid style={{margin: "2vw"}} item xs={12} >
              <Grid container justifyContent='center' alignItems='center' spacing={2}>
                <Grid item><Button component={RouterLink} to={'/partners'} variant='contained' size='large'>Cancel</Button></Grid>
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

  const { value, loading, error } = useAsync(async (): Promise<Partner> => {
    const response = await fetch(`http://localhost:7007/api/application/partner/${id}`);
    const data = await response.json();
    //console.log(data)
    return data.partners;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details partner={value}/>
  
}
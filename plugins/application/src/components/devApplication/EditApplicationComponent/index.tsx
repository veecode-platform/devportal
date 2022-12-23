/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Grid, Button, TextField, Paper} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Progress} from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation, Link as RouterLink } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { SearchFilter } from '@backstage/plugin-search-react';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { IApplication } from '../interfaces';
import AlertComponent from '../../Alert/Alert';

type Application = {
  application: IApplication | undefined;
}

const EditApplicationComponent = ({ application }: Application) => {
  const [app, setApp] = useState<IApplication | any>(application);
  const [show, setShow] = useState<boolean>(false);

  useEffect(()=>{
    setApp({
      name: application?.name,
      creator: application?.creator,
      active: application?.active,
      servicesId: application?.servicesId,
      kongConsumerName: application?.kongConsumerName,
      kongConsumerId: application?.kongConsumerId
    })
  },[application]);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
  };

  const handleSubmit = async () => {
    const applicationData = {
      application:{
        name: app.name,
        creator: app.name,
        active: app.active,
        servicesId: app.servicesId,
        kongServiceName: app.kongConsumerName,
        kongServiceId : app.kongConsumerId,
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(applicationData)
    };
    const response = await fetch(`http://localhost:7007/api/application/${app?.id}`, config); // check endpoint
    const data = await response.json();
    setShow(true);
    setTimeout(()=>{
      window.location.replace('/application');
    }, 2000);
    return data
  }
  return (
    <Page themeId="tool">
    <Header title="Application"> </Header>
    <Content>
    <ContentHeader title='Edit Application'> </ContentHeader>
    <AlertComponent open={show} close={handleClose} message="Success!" />

      <Grid container direction="row" justifyContent="center">
      <Grid item sm={12} lg={5}>
          <InfoCard>
            <Grid container spacing={3} direction='column' justifyContent="center">
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Application Name"
                    value={app.name ?? ''}
                    required
                    onChange={(e) => {
                      setApp({ ...app, name: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Creator"
                    value={app.creator ?? ''}
                    required
                    onChange={(e) => {
                      setApp({ ...app, creator: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <SearchContextProvider>
                    <Paper>
                      <SearchFilter.Autocomplete
                        multiple
                        name="Status"
                        label="Select the Application Status"
                        values={["active", "disable"]}
                      />
                    </Paper>
                  </SearchContextProvider>
                </Grid>
                <Grid item xs={12} >
                  <SearchContextProvider>
                    <Paper>
                      <SearchFilter.Autocomplete
                        multiple
                        name="Application Services"
                        label="Select the services"
                        values={app.servicesId}
                      />
                    </Paper>
                  </SearchContextProvider>
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Kong Consumer Name"
                    value={app.kongConsumerName ?? ''}
                    required
                    onChange={(e) => {
                      setApp({ ...app, kongConsumerName: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Kong Consumer Id"
                    value={app.kongConsumerId ?? ''}
                    required
                    onChange={(e) => {
                      setApp({ ...app, kongConsumerId: e.target.value })
                    }} />
                </Grid>
              <Grid item xs={12} >
                <Grid container justifyContent='center' alignItems='center'>
                  <Button component={RouterLink} to='/application' style={{margin:"16px"}} size='large' variant='outlined'>Cancel</Button>
                  <Button style={{margin:"16px"}} size='large' color='primary' type='submit' variant='contained' disabled={show} onClick={handleSubmit}>Save</Button>
                </Grid>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
        
      </Grid>
    </Content>
  </Page>
  );

}



export const EditComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];
  // eslint-disable-next-line no-console
  console.log(id);

  const { value, loading, error } = useAsync(async (): Promise<IApplication> => {
    const response = await fetch(`http://localhost:7007/api/application/${id}`);
    const data = await response.json();
    return data.application;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditApplicationComponent application={value}/>
  
}
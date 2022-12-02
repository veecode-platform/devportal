/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Paper } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import AlertComponent from '../Alert/Alert';
import { SearchFilter } from '@backstage/plugin-search-react';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { InfoCard, Header, Page, Content, ContentHeader} from '@backstage/core-components';
import { ICreateApp } from '../interfaces';

export const NewApplicationComponent = () => {
  const [application, setApplication] = useState<ICreateApp>({ name: "", creator: "", servicesId: [], kongConsumerName:"",kongConsumerId:"" });
  const [show, setShow] = useState<boolean>(false);

  // mock data
  useEffect(() => {
    return setApplication({ ...application, creator: "valberjr@teste.com", servicesId:['12324345465', '123432546r34', '43243245436546'] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
    setApplication({ name: "", creator: "", servicesId: [], kongConsumerName:"", kongConsumerId:"" });
  };

  const handleSubmit = async () => {
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(application)
    };
    const response = await fetch('http://localhost:7007/api/application/', config); // check endpoint
    const data = await response.json();
    // console.log("aplication: ", data)
    setShow(true)
    return data
  }
  return (
    <Page themeId="tool">
      <Header title="New Application"> </Header>
      <Content>
        <ContentHeader title='Create a new Application'> </ContentHeader>
        <AlertComponent open={show} close={handleClose} message="Application created!" />
        <Grid container direction="row" justifyContent="center">
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid container spacing={3} direction='column' justifyContent="center">
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Application Name"
                    value={application.name ?? ''}
                    required
                    onChange={(e) => {
                      setApplication({ ...application, name: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Creator"
                    value={application.creator ?? ''}
                    required
                    onChange={(e) => {
                      setApplication({ ...application, creator: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <SearchContextProvider>
                    <Paper>
                      <SearchFilter.Autocomplete
                        multiple
                        name="Application Services"
                        label="Select the services"
                        values={application.servicesId}
                      />
                    </Paper>
                  </SearchContextProvider>
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Kong Consumer Name"
                    value={application.kongConsumerName ?? ''}
                    required
                    onChange={(e) => {
                      setApplication({ ...application, kongConsumerName: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Kong Consumer Id"
                    value={application.kongConsumerId ?? ''}
                    required
                    onChange={(e) => {
                      setApplication({ ...application, kongConsumerId: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <Grid container justifyContent='center' alignItems='center'>
                    <Button component={RouterLink} to='/application' style={{ margin: "16px" }} size='large' color="primary" variant='contained'>Cancel</Button>
                    <Button style={{ margin: "16px" , background: "#20a082", color:"#fff"}}size='large' type='submit' variant='contained' disabled={show} onClick={handleSubmit}>Create</Button>
                  </Grid>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  )
};
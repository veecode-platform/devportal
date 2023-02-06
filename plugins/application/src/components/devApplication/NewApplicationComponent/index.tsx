/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable import/no-extraneous-dependencies */
import React, {useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AlertComponent } from '../../shared';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ICreateApplication } from '../interfaces';
import AxiosInstance from '../../../api/Api';
import { FetchServicesList } from '../../partners/CreateComponent';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';

export const NewApplicationComponent = () => {
  const user = useApi(identityApiRef)
  const [application, setApplication] = useState<ICreateApplication>({
    name: '',
    creator: "",
    active: true,
    servicesId: [],
    kongConsumerName: '',
    kongConsumerId: '',
  });
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    user.getBackstageIdentity().then( res => {
      return setApplication({ ...application, creator: res.userEntityRef.split("/")[1] });
    }).catch(e => {
      console.log(e)
      return setApplication({ ...application, creator: "default"});
    })
  
  }, []);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
    setApplication({
      name: '',
      creator: '',
      active: true,
      servicesId: [],
      kongConsumerName: '',
      kongConsumerId: '',
    });
  };

  const handleSubmit = async () => {
    const applicationData = {
      applications: {
        name: application.name,
        creator: application.name,
        active: application.active,
        servicesId: application.servicesId,
      },
    };
    const response = await AxiosInstance.post("/applications", JSON.stringify(applicationData))
    setShow(true);
    setTimeout(()=>{
      window.location.replace('/application');
    }, 2000);
    return response.data
  };
  return (
    <Page themeId="tool">
      <Header title="New Application"> </Header>
      <Content>
        <ContentHeader title="Create a new Application"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Application created!"
        />
        <Grid container direction="row" justifyContent="center">
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid
                container
                spacing={3}
                direction="column"
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Application Name"
                    value={application.name ?? ''}
                    required
                    onChange={e => {
                      setApplication({ ...application, name: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Creator"
                    value={application.creator ?? ''}
                    required
                    InputProps={{
                      readOnly: true,
                    }}                  
                    /*onChange={e => {
                      setApplication({
                        ...application,
                        creator: e.target.value,
                      });
                    }}*/
                  />
                </Grid>
                <Grid item lg={12}>
                  <FetchServicesList partner={application} setPartner={setApplication}/>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Button
                      component={RouterLink}
                      to="/application"
                      style={{ margin: '16px' }}
                      size="large"
                      color="primary"
                      variant="contained"
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{
                        margin: '16px',
                        background: '#20a082',
                        color: '#fff',
                      }}
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={show}
                      onClick={handleSubmit}
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

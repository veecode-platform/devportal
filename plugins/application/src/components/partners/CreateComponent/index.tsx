/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AlertComponent, Select } from '../../shared';
import AxiosInstance from '../../../api/Api';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ICreatePartner } from '../interfaces';

export const CreateComponent = () => {
  const [partner, setPartner] = useState<ICreatePartner>({
    name: '',
    active: true,
    email: '',
    celular: '',
    servicesId: [],
    applicationId: []
  });

  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
    setPartner({
      name: '',
      active: true,
      email: '',
      celular: '',
      servicesId: [],
      applicationId: []
    });
  };

  const servicesIdMock = [
    '1234256656-45354',
    'w4trgehwfreutir235-4545',
    '456789fogfg9r03-e5345',
  ];

  const applicationIdMock = [
    '1234256656-45354',
    'w4trgehwfreutir235-4545',
    '456789fogfg9r03-e5345',
  ];

  const handleSubmit = async () => {

    const dataPartner = {
      partner: {
        name: partner.name,
        active: partner.active,
        email: partner.email,
        celular: partner.celular, // to do
        servicesId: partner.servicesId,
        applicationId: partner.applicationId
      }
    }
    /*const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(dataPartner)
    };

    const response = await fetch('http://localhost:7007/api/application/partner', config);
    const data = await response.json();*/
    const response = await AxiosInstance.post("/partners", JSON.stringify(dataPartner) )
    setShow(true);
    setTimeout(() => {
      window.location.replace('/application');
    }, 2000);
    return response.data;
  }

  return (
    <Page themeId="tool">
      <Header title="Partner"> </Header>
      <Content>
        <ContentHeader title='New Partner'> </ContentHeader>
        <AlertComponent open={show} close={handleClose} message="Registered Partner!" />
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
                    label="Name"
                    value={partner.name ?? ''}
                    required
                    onChange={e => {
                      setPartner({ ...partner, name: e.target.value });
                    }}
                  />
                </Grid>

                <Grid item lg={12}>
                  <Select
                    placeholder="Application Id"
                    label="Application Id"
                    items={applicationIdMock.map(item => {
                      return { ...{ label: item, value: item } };
                    })}
                    multiple
                    onChange={e => {
                      setPartner({ ...partner, applicationId: e });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    placeholder="Services Id"
                    label="Services Id"
                    items={servicesIdMock.map(item => {
                      return { ...{ label: item, value: item } };
                    })}
                    multiple
                    onChange={e => {
                      setPartner({ ...partner, servicesId: e });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={partner.email ?? ''}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        email: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type='number'
                    variant="outlined"
                    label="Phone"
                    value={partner.celular ?? ''}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        celular: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Button
                      component={RouterLink}
                      to="/partners"
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
  )
};



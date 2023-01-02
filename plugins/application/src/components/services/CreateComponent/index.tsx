/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button, Select, MenuItem } from '@material-ui/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {AlertComponent} from '../../shared';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ICreateService } from '../interfaces';
import { FetchKongServices } from './kongUtils';

export const CreateComponent = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<ICreateService>({
    serviceId: '',
    name: '',
    active: true,
    description: '',
    security: '',
    rateLimiting: 0,
  });
  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setService({
      serviceId: '',
      name: '',
      active: true,
      description: '',
      security: '',
      rateLimiting: 0,
    });
  };

  const handleSubmit = async () => {
    const dataTest = {
      serviceData: {
        name: service.name,
        description: service.description,
        partnersId: [],
        rateLimiting: service.rateLimiting,
        // kongServiceName:service,
        // kongServiceId :service,
      },
    };
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(dataTest),
    };

    const response = await fetch(
      'http://localhost:7007/api/application/service',
      config,
    );
    const data = await response.json();
    setShow(true);
    setTimeout(() => {
      navigate('/services');
    }, 2000);
    return data;
  };

  return (
    <Page themeId="tool">
      <Header title="New Service"> </Header>
      <Content>
        <ContentHeader title="Create a new Service"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Service Registered!"
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
                  <FetchKongServices
                    valueName={service}
                    setValue={setService}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Description"
                    multiline
                    value={service.description}
                    minRows={3}
                    required
                    onChange={e => {
                      setService({ ...service, description: e.target.value });
                    }}
                  />
                </Grid>
                                                                                    {/* <<----------------------  TO DO */}
                <Grid item xs={12}>                                                       
                  <Select
                    fullWidth
                    variant="outlined"
                    value={service.rateLimiting}
                    displayEmpty
                    onChange={e => {
                      setService({
                        ...service,
                        rateLimiting: e.target.value as number,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>0</em>
                    </MenuItem>
                    <MenuItem value="none">
                      <em>100</em>
                    </MenuItem>
                    <MenuItem value="api key">200</MenuItem>
                    <MenuItem value="api key">300</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Select
                    fullWidth
                    variant="outlined"
                    value={service.security}
                    displayEmpty
                    onChange={e => {
                      setService({
                        ...service,
                        security: e.target.value as string,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>Security</em>
                    </MenuItem>
                    <MenuItem value="none">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="api key">Api Key</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Button
                      component={RouterLink}
                      to="/services"
                      style={{ margin: '16px' }}
                      size="large"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ margin: '16px' }}
                      size="large"
                      color="primary"
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

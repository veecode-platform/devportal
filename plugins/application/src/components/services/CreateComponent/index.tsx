/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AlertComponent } from '../../shared';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ICreateService } from '../utils/interfaces';
import { FetchKongServices } from '../utils/kongUtils';
import { rateLimitingItems, securityItems } from '../utils/common';
import { Select } from '../../shared';
import AxiosInstance from '../../../api/Api';

export const CreateComponent = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<ICreateService>({
    name: '',
    kongServiceName:'',
    active: true,
    description: '',
    redirectUrl: '',
    kongServiceId: '',
    securityType: '',
    rateLimiting: 0,
  });
  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setService({
      name: '',
      kongServiceName:'',
      active: true,
      description: '',
      redirectUrl: '',
      kongServiceId: '',
      securityType: '',
      rateLimiting: 0,
    });
  };

  const handleSubmit = async () => {
    const servicePost = {
      services: {
        name: service.name,
        kongServiceName:service,
        active: service.active,
        description: service.description,
        redirectUrl: service.redirectUrl,
        kongServiceId: service.kongServiceId,
        rateLimiting: service.rateLimiting,
        securityType: service.securityType,
      },
    };
    /*const config = {
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
    const data = await response.json();*/
    const response = await AxiosInstance.post("/services", JSON.stringify(servicePost) )
    setShow(true);
    setTimeout(() => {
      navigate('/services');
    }, 2000);
    return response.data;
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
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid
                container
                spacing={3}
                direction="row"
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Service Name"
                    value={service.name}
                    required
                    onChange={e => {
                      setService({ ...service, name: e.target.value });
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <FetchKongServices
                    valueName={service}
                    setValue={setService}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                      placeholder="Select the Status"
                      label="Service Status"
                      items={[{label:'active', value: 'true' }, {label:'inactive', value: 'false' }]}
                      onChange={e => {
                          setService({ ...service, active: e == "true" ? true : false });
                      }}
                    />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Url"
                    value={service.redirectUrl}
                    required
                    onChange={e => {
                      setService({ ...service, redirectUrl: e.target.value });
                    }}
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

                <Grid
                  item
                  style={{
                    display: 'grid',
                    gridTemplate: 'auto / repeat(2, 1fr)',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap:'1em',
                    width: '100%',
                  }}
                >
                  <Select
                    onChange={e => {
                      setService({ ...service, securityType: e });
                    }}
                    placeholder="Select the Security Type"
                    label="Security Type"
                    items={securityItems}
                  />
                  <Select
                    onChange={e => {
                      setService({ ...service, rateLimiting: e });
                    }}
                    placeholder="Select the Rate Limiting"
                    label="rate Limiting"
                    items={rateLimitingItems}
                  />
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

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
import { SecurityTypeEnum } from '../utils/enum';
import { Select } from '@backstage/core-components';

export const CreateComponent = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<ICreateService>({
    serviceId: '',
    name: '',
    active: true,
    description: '',
    redirectUrl: '',
    securityType: '',
    rateLimiting: 0,
  });
  const [show, setShow] = useState(false);
  const securityItems = [
    { label: SecurityTypeEnum.none, value: SecurityTypeEnum.none },
    { label: SecurityTypeEnum.keyAuth, value: SecurityTypeEnum.keyAuth },
    { label: SecurityTypeEnum.oAuth2, value: SecurityTypeEnum.oAuth2 },
  ];
  const rateLimitingItems = [
    { label: '0', value: 0 },
    { label: '120', value: 120 },
  ];

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setService({
      serviceId: '',
      name: '',
      active: true,
      description: '',
      redirectUrl: '',
      securityType: '',
      rateLimiting: 0,
    });
  };

  const handleSubmit = async () => {
    const dataTest = {
      serviceData: {
        name: service.name ?? 'teste',
        description: service.description,
        redirectUrl: service.redirectUrl,
        partnersId: [],
        rateLimiting: service.rateLimiting,
        securityType: service.securityType,
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
                direction="column"
                justifyContent="center"
              >
                <Grid item lg={12}>
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

                <Grid
                  item
                  style={{
                    display: 'grid',
                    gridTemplate: 'auto / repeat(2, 1fr)',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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

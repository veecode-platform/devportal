/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import { AlertComponent } from '../../shared';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import { Progress } from '@backstage/core-components';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { IService } from '../utils/interfaces';
import { Select } from '../../shared';
import { rateLimitingItems, securityItems, statusItems } from '../utils/common';

type ServiceProps = {
  serviceData: IService | undefined;
};

const EditPageComponent = ({ serviceData }: ServiceProps) => {
  const navigate = useNavigate();
  const [service, setService] = useState<IService>({
    name: serviceData?.name ?? '...',
    active: serviceData?.active,
    description: serviceData?.description ?? '...',
    redirectUrl: serviceData?.redirectUrl ?? '...',
    partnersId: serviceData?.partnersId ?? [],
    rateLimiting: serviceData?.rateLimiting ?? 0,
    kongServiceName: serviceData?.kongServiceName ?? '...',
    kongServiceId: serviceData?.kongServiceId ?? '...',
    securityType: serviceData?.securityType ?? 'none',
  });
  const [show, setShow] = useState(false);

  const serviceNamesItems = [
    'Google',
    'Kong',
    'Kubernetes',
    'Kubernetes helm',
    'Kubernetes kunectl',
    'Kubernetes Kustomize',
    'Kubernetes Minikube',
    'Kubernetes Minikuve Kustomise',
    'Kubernetes Minikube Kustom',
  ];

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
    setService({
      name: '',
      active: true,
      description: '',
      redirectUrl: '',
      partnersId: [],
      rateLimiting: 0,
      kongServiceName: '',
      kongServiceId: '',
      securityType: '',
    });
  };

  const handleSubmit = async () => {
    const dataTest = {
      service: {
        name: service.name,
        active: service.active,
        description: service.description,
        redirectUrl: service.redirectUrl,
        partnersId: service.partnersId,
        rateLimiting: service.rateLimiting,
        kongServiceName: service.kongServiceName,
        kongServiceId: service.kongServiceId,
        securityType: service.securityType,
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
      `http://localhost:7007/api/application/service/${service?.id}`,
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
      <Header title="Service"> </Header>
      <Content>
        <ContentHeader title="Edit Service"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Service Edited!"
        />

        <Grid container direction="row" justifyContent="center">
          <Grid item sm={12} lg={5}>
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
                    label="Service Name"
                    value={service.name}
                    required
                    onChange={e => {
                      setService({ ...service, name: e.target.value });
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
                    placeholder="Select the Kong Service Name"
                    label="Service Name"
                    items={serviceNamesItems.map(item => {
                      return { ...{ label: item, value: item } };
                    })}
                    onChange={e => {
                      setService({ ...service, kongServiceName: e });
                    }}
                  />
                  <Select
                    placeholder="Select the Status"
                    label="Service Status"
                    items={statusItems}
                    onChange={e => {
                      if (e === 'true')
                        setService({ ...service, active: true });
                      else setService({ ...service, active: false });
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
                    label="Kong Service Id"
                    value={service.kongServiceId}
                    required
                    onChange={e => {
                      setService({ ...service, kongServiceId: e.target.value });
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
                    placeholder={service.securityType}
                    label="Select the Security Type"
                    items={securityItems}
                  />
                  <Select
                    onChange={e => {
                      setService({ ...service, rateLimiting: e });
                    }}
                    placeholder={service.rateLimiting}
                    label="Select Rate Limiting"
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
                      Save
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

export const EditComponent = () => {
  const location = useLocation();
  const id = location.search.split('?id=')[1];

  const { value, loading, error } = useAsync(async (): Promise<IService> => {
    const response = await fetch(
      `http://localhost:7007/api/application/service/${id}`,
    );
    const data = await response.json();
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent serviceData={value} />;
};

/* eslint-disable no-console */
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
import AxiosInstance from '../../../api/Api';
import { FetchKongServices } from '../utils/kongUtils';

type ServiceProps = {
  serviceData: IService | undefined;
};

const EditPageComponent = ({ serviceData }: ServiceProps) => {
  const navigate = useNavigate();
  const [service, setService] = useState<IService>({
    id: serviceData?.id,
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
    
    const data = {                                       
       services:{
        name: service.name,
        active: service.active,
        description: service.description,
        redirectUrl: service.redirectUrl,
        partnersId: service.partnersId,
        rateLimiting: service.rateLimiting,
        kongServiceName: service.kongServiceName,
        kongServiceId: service.kongServiceId,
        securityType: service.securityType,
       }
    };
    const response = await AxiosInstance.put(`services/${service?.id}`, JSON.stringify(data))
    setShow(true);
    setTimeout(() => {
      navigate('/services');
    }, 2000);
    return response.data;
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
                    gridTemplate: 'auto / 2fr 1fr',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap:'1em',
                    width: '100%',
                  }}
                >
                  <FetchKongServices
                    valueName={service.kongServiceName}
                    setValue={setService}
                    selected={`${service.kongServiceName}---${service.kongServiceId}`}
                  />
                  <Select
                    placeholder="Select the Status"
                    label="Service Status"
                    selected={service.active ? "true" : "false"}
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
    const { data } = await AxiosInstance.get(`/services/${id}`)
    return data.services;                            
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent serviceData={value} />;
};

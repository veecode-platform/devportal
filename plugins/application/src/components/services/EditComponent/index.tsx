import React, { useState } from 'react';
import { Grid, TextField, Button, Checkbox, FormControlLabel, } from '@material-ui/core';
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
import { securityItems } from '../utils/common';
import { SecurityTypeEnum } from '../utils/enum';
import AxiosInstance from '../../../api/Api';
import { useAppConfig } from '../../../hooks/useAppConfig';

type ServiceProps = {
  serviceData: IService | undefined;
};

const EditPageComponent = ({ serviceData }: ServiceProps) => {
  const navigate = useNavigate();
  const [applySecurity, setApplySecurity] = useState<boolean>(false)
  const [applyRateLimit, setApplyRateLimit] = useState<boolean>(false)
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

  const [service, setService] = useState<IService>({
    id: serviceData?.id,
    name: serviceData?.name ?? '...',
    active: serviceData?.active,
    description: serviceData?.description ?? '...',
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
      partnersId: [],
      rateLimiting: 0,
      kongServiceName: '',
      kongServiceId: '',
      securityType: '',
    });
  };

  const BackendBaseUrl = useAppConfig().BackendBaseUrl;

  const handleSubmit = async () => {
    setLoadingUpdate(true)
    let data = {                                       
      name: service.name,
      active: service.active,
      description: service.description,       
    }
    if(applyRateLimit) data = Object.assign(data, { rateLimiting: service.rateLimiting })
    if(applySecurity) data = Object.assign(data, { securityType: service.securityType })

    const payload = {
      service: {...data}
    }

    const response = await AxiosInstance.patch(`${BackendBaseUrl}/services/${service?.id}`, JSON.stringify(payload))
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

        <Grid container direction="row" justifyContent="center" alignItems="center" alignContent="center">
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid
                container
                spacing={3}
                direction="row"
                justifyContent="center"
              >
                <Grid item xs={12} md={9}>
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
                <Grid item xs={12} md={3} >
                  <Select
                    placeholder="Select the Status"
                    label="Service Status"
                    selected={service.active ? "true" : "false"}
                    items={[{label:'active', value: 'true' }, {label:'inactive', value: 'false' }]}
                    onChange={e => {
                      setService({ ...service, active: e === "true" ? true : false });
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

                <Grid container xs={12} justifyContent='space-between' alignContent='center' alignItems='center'>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={applySecurity}
                      label="Change security plugins?"
                      labelPlacement='end'
                      control={<Checkbox size='small' onChange={()=>{setApplySecurity(!applySecurity)}}/>}
                    />                                       
                    <Select
                      onChange={e => {
                        setService({ ...service, securityType: e });
                      }}
                      placeholder="Select the Security Type"
                      selected={service.securityType == "oauth2" ? SecurityTypeEnum.oAuth2  : SecurityTypeEnum.keyAuth}
                      label="Security Type"
                      items={securityItems}
                      disabled={!applySecurity}
                    />
                  </Grid>

                  <Grid item xs={6} >
                    <FormControlLabel
                        value={applyRateLimit}
                        label="Change rate limit?"
                        labelPlacement='end'
                        control={<Checkbox size='small' onChange={()=>{setApplyRateLimit(!applyRateLimit)}}/>}
                    />
                    <TextField
                    type='number'
                    fullWidth
                    variant="outlined"
                    value={service.rateLimiting}
                    disabled={!applyRateLimit}
                    onChange={e => {
                      setService({ ...service, rateLimiting: e.target.value });
                    }}
                  />  
                  </Grid>
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
                      disabled={loadingUpdate}
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
  const BackendBaseUrl = useAppConfig().BackendBaseUrl;

  const { value, loading, error } = useAsync(async (): Promise<IService> => {
    const { data } = await AxiosInstance.get(`${BackendBaseUrl}/services/${id}`)
    return data.service;                            
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent serviceData={value} />;
};

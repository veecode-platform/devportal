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
import { IErrorStatus, IPartner } from '../interfaces';
import { Select } from '../../shared';
import AxiosInstance from '../../../api/Api';
import { FetchApplicationsList, FetchServicesList } from '../commons';
import {
  validateEmail,
  validateName,
  validatePhone,
} from '../commons/validate';

type PartnerProps = {
  partnerData: IPartner | undefined;
};

const EditPageComponent = ({ partnerData }: PartnerProps) => {
  const navigate = useNavigate();

  const [partner, setPartner] = useState<IPartner>({
    id: partnerData?.id,
    name: partnerData?.name ?? '',
    active: partnerData?.active ?? true,
    email: partnerData?.email ?? '',
    phone: partnerData?.phone ?? '',
    servicesId: partnerData?.servicesId ?? [],
    applicationId: partnerData?.applicationId ?? [],
  });

  const [show, setShow] = useState(false);

  const [errorField, setErrorField] = useState<IErrorStatus>({
    name: false,
    email: false,
    phone: false,
  });

  const statusItems = [
    { label: 'active', value: 'true' },
    { label: 'inactive', value: 'false' },
  ];

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
    setPartner({
      name: '',
      active: true,
      email: '',
      phone: '',
      servicesId: [],
      applicationId: [],
    });
  };

  const handleSubmit = async () => {
    const dataPartner = {
      partners: {
        name: partner.name,
        active: partner.active,
        email: partner.email,
        phone: partner.phone,
        servicesId: partner.servicesId,
        applicationId: partner.applicationId,
      },
    };
    const response = await AxiosInstance.put(
      `/partners/${partner?.id}`,
      JSON.stringify(dataPartner),
    );
    setShow(true);
    setTimeout(() => {
      navigate('/partners');
    }, 2000);
    return response.data.partners;
  };

  return (
    <Page themeId="tool">
      <Header title="Partners"> </Header>
      <Content>
        <ContentHeader title="Edit Partner"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Partner Edited!"
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
                    label="Name"
                    value={partner.name}
                    required
                    onChange={e => {
                      setPartner({ ...partner, name: e.target.value });
                      if (!!validateName(e.target.value))
                        setErrorField({ ...errorField, name: true });
                      else setErrorField({ ...errorField, name: false });
                    }}
                    error={errorField.name}
                    helperText={
                      errorField.name
                        ? 'Enter a name with at least 3 characters'
                        : null
                    }
                  />
                </Grid>

                <Grid item lg={12}>
                  <Select
                    placeholder="Select the Status"
                    label="Service Status"
                    items={statusItems}
                    selected={partner.active ? 'true' : 'false'}
                    onChange={e => {
                      if (e === 'true')
                        setPartner({ ...partner, active: true });
                      else setPartner({ ...partner, active: false });
                    }}
                  />
                </Grid>

                <Grid item lg={12}>
                  <FetchServicesList
                    partner={partner}
                    setPartner={setPartner}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FetchApplicationsList
                    partner={partner}
                    setPartner={setPartner}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={partner.email}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        email: e.target.value,
                      });
                      if (!!validateEmail(e.target.value))
                        setErrorField({ ...errorField, email: true });
                      else setErrorField({ ...errorField, email: false });
                    }}
                    error={errorField.email}
                    helperText={errorField.email ? 'Enter a valid email' : null}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="tel"
                    variant="outlined"
                    placeholder="Phone"
                    label="Phone"
                    value={partner.phone}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        phone: e.target.value,
                      });
                      if (!!validatePhone(e.target.value as string))
                        setErrorField({ ...errorField, phone: true });
                      else setErrorField({ ...errorField, phone: false });
                    }}
                    error={errorField.phone}
                    helperText={errorField.phone ? 'enter a valid phone' : null}
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
                      disabled={
                        errorField.name || errorField.email || errorField.phone
                      }
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

  const { value, loading, error } = useAsync(async (): Promise<IPartner> => {
    const { data } = await AxiosInstance.get(`/partners/${id}`);
    return data.partners;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent partnerData={value} />;
};

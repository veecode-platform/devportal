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
import { IPartner } from '../interfaces';
import { Select } from '../../shared';

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
    celular: partnerData?.celular ?? '',
    servicesId: partnerData?.servicesId ?? [],
    applicationId: partnerData?.applicationId ?? [],
  });
  const [show, setShow] = useState(false);

  const statusItems = [
    { label: 'active', value: 'true' },
    { label: 'disable', value: 'false' },
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
      celular: '',
      servicesId: [],
      applicationId: [],
    });
  };

  const handleSubmit = async () => {
    const dataPartner = {
      partner: {
        name: partner.name,
        active: partner.active,
        email: partner.email,
        celular: partner.celular, // to do
        servicesId: partner.servicesId,
        applicationId: partner.applicationId,
      },
    };
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(dataPartner),
    };

    const response = await fetch(
      `http://localhost:7007/api/application/partner/${partner?.id}`,
      config,
    );
    const data = await response.json();
    setShow(true);
    setTimeout(() => {
      navigate('/partners');
    }, 2000);
    return data;
  };

  return (
    <Page themeId="tool">
      <Header title="Service"> </Header>
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
                    value={partner.name ?? ''}
                    required
                    onChange={e => {
                      setPartner({ ...partner, name: e.target.value });
                    }}
                  />
                </Grid>

                <Grid item lg={12}>
                  <Select
                    placeholder="Select the Status"
                    label="Service Status"
                    items={statusItems}
                    onChange={e => {
                      if (e === 'true')
                        setPartner({ ...partner, active: true });
                      else setPartner({ ...partner, active: false });
                    }}
                  />
                </Grid>

                <Grid item lg={12}>
                  <Select
                    placeholder="Application Id"
                    label="Application Id"
                    items={partner.applicationId.map(item => {
                      return { ...{ label: item, value: item } };
                    })}
                    multiple
                    onChange={(e: string | any) => {
                      setPartner({ ...partner, applicationId: e });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    placeholder="Services Id"
                    label="Services Id"
                    items={partner.servicesId.map(item => {
                      return { ...{ label: item, value: item } };
                    })}
                    multiple
                    onChange={(e: string | any) => {
                      setPartner({ ...partner, servicesId: e });
                    }}
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
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="Phone"
                    value={partner.celular}
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
  );
};

export const EditComponent = () => {
  const location = useLocation();
  const id = location.search.split('?id=')[1];

  const { value, loading, error } = useAsync(async (): Promise<IPartner> => {
    const response = await fetch(
      `http://localhost:7007/api/application/partner/${id}`,
    );
    const data = await response.json();
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent partnerData={value} />;
};

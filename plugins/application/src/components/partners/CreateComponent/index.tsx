import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AlertComponent } from '../../shared';
import AxiosInstance from '../../../api/Api';
import { Alert } from '@material-ui/lab';
import useAsync from 'react-use/lib/useAsync';
import { Select } from '../../shared';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  Progress,
} from '@backstage/core-components';
import { IErrorStatus } from '../interfaces';
import { FetchServicesList } from '../commons';
import {
  validateEmail,
  validateName,
} from '../../shared/commons/validate';
import { useAppConfig } from '../../../hooks/useAppConfig';


const KeycloakUsersList = ({partner, setPartner}: any) =>{
  const BackendBaseUrl = useAppConfig().BackendBaseUrl;
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const {data} = await AxiosInstance.get(`${BackendBaseUrl}/keycloak/users`);
    return data.users;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Select
      placeholder="Keycloak User"
      label="Keycloak User"
      items={value.map((item: any) => {
        return { ...{ label: item.username, value: `${item.id}---${item.username}---${item.email}`, key: item.id } };
        })}
      onChange={e => {
        const splited = e.toString().split("---")
        setPartner({...partner,
          keycloakId: splited[0],
          name: splited[1],
          email: splited[2],
        })
      }}
    />
  )

}

export const CreateComponent = () => {
  const [partner, setPartner] = useState<any>({
    name: '',
    active: true,
    email: '',
    keycloakId: "",
    servicesId: [],
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const BackendBaseUrl = useAppConfig().BackendBaseUrl;

  const [errorField, setErrorField] = useState<IErrorStatus>({
    name: false,
    email: false,
  });

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
    setPartner({
      name: '',
      active: true,
      email: '',
      keycloakId: "",
      servicesId: [],
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const dataPartner = {
      partner: {
        name: partner.name,
        active: partner.active,
        email: partner.email,
        keycloakId: partner.keycloakId,
        servicesId: partner.servicesId,
      },
    };

    const {data} = await AxiosInstance.post(`${BackendBaseUrl}/partners`,JSON.stringify(dataPartner));
    setShow(true);
    setTimeout(() => {
      window.location.replace('/partners');
    }, 2000);
     return data;
  };

  return (
    <Page themeId="tool">
      <Header title="Partner"> </Header>
      <Content>
        <ContentHeader title="New Partner"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Registered Partner!"
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
                  <KeycloakUsersList partner={partner} setPartner={setPartner}/>
                </Grid>
                <Grid item xs={12}>
                  <FetchServicesList partner={partner} setPartner={setPartner}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Name"
                    value={partner.name ?? ''}
                    required
                    disabled
                    onBlur={ (e) => {if (e.target.value === "") setErrorField({ ...errorField, name: true }) }}
                    onChange={e => {
                      setPartner({ ...partner, name: e.target.value });
                      if (validateName(e.target.value))
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    disabled
                    type="email"
                    value={partner.email ?? ''}
                    required
                    onBlur={ (e) => {if (e.target.value === "") setErrorField({ ...errorField, email: true }) }}
                    onChange={e => {
                      setPartner({
                        ...partner,
                        email: e.target.value,
                      });
                      if (validateEmail(e.target.value))
                        setErrorField({ ...errorField, email: true });
                      else setErrorField({ ...errorField, email: false });
                    }}
                    error={errorField.email}
                    helperText={errorField.email ? 'Enter a valid email' : null}
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
                      }}
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={
                        errorField.name || errorField.email || loading
                      }
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

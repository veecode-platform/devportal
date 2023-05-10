import React, {useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AlertComponent, Select } from '../../shared';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  Progress,
} from '@backstage/core-components';
import { ICreateApplication } from '../interfaces';
import AxiosInstance from '../../../api/Api';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { Alert } from '@material-ui/lab';
import useAsync from 'react-use/lib/useAsync';
import {IErrorStatus} from '../interfaces';
import { validateName } from '../../shared/commons/validate';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { usePermission } from '@backstage/plugin-permission-react';
import { adminAccessPermission } from '@internal/plugin-application-common';



export const FetchServicesList = ({partner, setPartner}: any) => {
  const user = useApi(identityApiRef);
  const BackendBaseUrl = useAppConfig().BackendBaseUrl;


  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const userIdentityToken = await user.getCredentials()
    const {data} = await AxiosInstance.get(`${BackendBaseUrl}/services`, {headers:{ Authorization: `Bearer ${userIdentityToken.token}`}});
    return data.services
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
  <Select
    placeholder="Services"
    label="Services"
    items={value.map((item: any) => {
      return { ...{ label: item.name, value: item.id, key: item.id } };
      })}
    multiple
    onChange={e => {
    setPartner({ ...partner, servicesId: e });
    }}
  />)
};

export const FetchApplicationsList = ({partner, setPartner}: any) => {

  const BackendBaseUrl = useAppConfig().BackendBaseUrl;

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const {data} = await AxiosInstance.get(`${BackendBaseUrl}/applications`);
    return data.applications;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
  <Select
    placeholder="Applications"
    label="Applications"
    items={value.map((item: any) => {
      return { ...{ label: item.name, value: item.id, key: item.id } };
      })}
    multiple
    onChange={e => {
    setPartner({ ...partner, applicationId: e });
    }}
  />)
};



export const NewApplicationComponent = () => {
  const { loading: loadingPermission, allowed: adminView } = usePermission({permission: adminAccessPermission});

  const user = useApi(identityApiRef)
  const [application, setApplication] = useState<ICreateApplication>({
    name: '',
    creator: "",
    active: true,
    servicesId: "",
  });
  const [show, setShow] = useState<boolean>(false);
  const [errorField, setErrorField] = useState<IErrorStatus>({
    name: false
  });
  const [loadingCreate, setLoadingCreate] = useState(false)

  const BackendBaseUrl = useAppConfig().BackendBaseUrl;

  useEffect(() => {
    if(!adminView){
      user.getBackstageIdentity().then( res => {
        return setApplication({ ...application, creator: res.userEntityRef.split("/")[1] });
      }).catch(() => {
        return setApplication({ ...application, creator: "default"});
      })
  }
  
  }, []);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
    setApplication({
      name: '',
      creator: '',
      active: true,
      servicesId: '',
    });
  };

  const handleSubmit = async () => {  
    setLoadingCreate(true)        
    const applicationData = {
      application: {
        name: application.name,
        creator: application.creator,
        active: application.active,
        services: application.servicesId,
      },
    };
    const response = await AxiosInstance.post(`${BackendBaseUrl}/applications`, JSON.stringify(applicationData))
    setShow(true);
    setTimeout(()=>{
      //setLoadingCreate(false)
      window.location.replace('/applications');
    }, 2000);
    return response.data
  };
  return (
    <Page themeId="tool">
      <Header title="New Application"> </Header>
      <Content>
        <ContentHeader title="Create a new Application"> </ContentHeader>
        <AlertComponent
          open={show}
          close={handleClose}
          message="Application created!"
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
                    label="Application Name"
                    value={application.name ?? ''}
                    required
                    onBlur={ (e) => {if (e.target.value === "") setErrorField({ ...errorField, name: true }) }}
                    onChange={e => {
                      setApplication({ ...application, name: e.target.value });
                      if (validateName(e.target.value)) setErrorField({ ...errorField, name: true });
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
                  {(!loadingPermission && adminView) && 
                    <UsersList application={application} setApplication={setApplication}/>
                  }
                  {(!loadingPermission && !adminView) && 
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Creator"
                      value={application.creator}
                      required
                      InputProps={{
                        readOnly: true,
                      }}                  
                    />
                  }
                  
                </Grid>
                <Grid item lg={12}>
                  <FetchServicesList partner={application} setPartner={setApplication}/>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Button
                      component={RouterLink}
                      to="/applications"
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
                      disabled={errorField.name || loadingCreate}
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

const UsersList = ({application, setApplication}: any) =>{
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
      placeholder="Creator"
      label="Creator"
      items={value.map((item: any) => {
        return { ...{ label: item.username, value: item.username } };
        })}
      onChange={e => { setApplication({...application, creator: e  }) }}
    />
  )

}

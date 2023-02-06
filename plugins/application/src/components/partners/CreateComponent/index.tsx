/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AlertComponent } from '../../shared';
import AxiosInstance from '../../../api/Api'; 
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ICreatePartner } from '../interfaces';
import { FetchApplicationsList, FetchServicesList } from '../commons';
import { validateEmail, validateName, validatePhone } from '../commons/validate';

export const CreateComponent = () => {
  const [partner, setPartner] = useState<ICreatePartner>({
    name: '',
    active: true,
    email: '',
    phone: '',
    servicesId: [],
    applicationId: []
  });

  const [show, setShow] = useState(false);

  const [errorField, setErrorField] = useState({name: false, email: false, phone: false});

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
      applicationId: []
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
        applicationId: partner.applicationId
      }
    }

    const response = await AxiosInstance.post("/partners", JSON.stringify(dataPartner) )
    setShow(true);
    setTimeout(() => {
      window.location.replace('/partners');
    }, 2000);
    return response.data;
  }

  return (
    <Page themeId="tool">
      <Header title="Partner"> </Header>
      <Content>
        <ContentHeader title='New Partner'> </ContentHeader>
        <AlertComponent open={show} close={handleClose} message="Registered Partner!" />
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
                      if(!!validateName(e.target.value)) setErrorField({...errorField, name: true});
                      else setErrorField({...errorField, name: false});
                    }}
                    error={errorField.name}
                    helperText={errorField.name ? "Enter a name with at least 3 characters" : null}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FetchServicesList partner={partner} setPartner={setPartner}/>
                </Grid>
                <Grid item lg={12}>
                <FetchApplicationsList partner={partner} setPartner={setPartner}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    type="email"
                    value={partner.email ?? ''}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        email: e.target.value,
                      });
                      if(!!validateEmail(partner.email)) setErrorField({...errorField, email: true});
                      else setErrorField({...errorField, email: false});
                    }}
                    error={errorField.email}
                    helperText={errorField.email ? "Enter a valid email" : null}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type='text'
                    variant="outlined"
                    label="Phone"
                    value={partner.phone ?? ''}
                    required
                    onChange={e => {
                      setPartner({
                        ...partner,
                        phone: e.target.value,
                      });
                      if(!!validatePhone(e.target.value as string)) setErrorField({...errorField, phone: true});
                      else setErrorField({...errorField, phone: false});
                    }}
                    error={errorField.phone}
                    helperText={errorField.phone ? "enter a valid phone" : null}
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
                      disabled={errorField.name || errorField.email || errorField.phone }
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
  )
};



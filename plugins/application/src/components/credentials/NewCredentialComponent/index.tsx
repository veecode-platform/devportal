/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import AlertComponent from '../../Alert/Alert';
import { InfoCard, Header, Page, Content, ContentHeader } from '@backstage/core-components';

export const NewCredentialComponent = () => {
  const [credential, setCredential] = useState({ key: "", createdAt:""});
  const [show, setShow] = useState<boolean>(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
    setCredential({ key: "", createdAt:""});
  };

  const handleSubmit = async () => {
    setCredential({...credential, createdAt: Date()});
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(credential)
    };
    const response = await fetch('http://localhost:7007/api/credential/', config); // check endpoint
    const data = await response.json();
    // console.log("aplication: ", data)
    setShow(true)
    return data
  }
  return (
    <Page themeId="tool">
      <Header title="New Application"> </Header>
      <Content>
        <ContentHeader title='Create a new Application'> </ContentHeader>
        <AlertComponent open={show} close={handleClose} message="Application created!" />
        <Grid container direction="row" justifyContent="center">
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid container spacing={3} direction='column' justifyContent="center">
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Credential Key"
                    value={credential.key ?? ''}
                    required
                    onChange={(e) => {
                      setCredential({ ...credential, key: e.target.value })
                    }} />
                </Grid>
                <Grid item xs={12} >
                  <Grid container justifyContent='center' alignItems='center'>
                    <Button component={RouterLink} to='/credentials' style={{ margin: "16px" }} size='large' color="primary" variant='contained'>Cancel</Button>
                    <Button style={{ margin: "16px", background: "#20a082", color: "#fff" }} size='large' type='submit' variant='contained' disabled={show} onClick={handleSubmit}>Create</Button>
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
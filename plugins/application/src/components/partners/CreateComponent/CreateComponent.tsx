import React, {useState} from 'react';
import { Grid, TextField, Button} from '@material-ui/core';
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import AlertComponent from '../../Alert/Alert';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader, 
} from '@backstage/core-components';


export const CreateComponent = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cel, setCel] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
    setName("")
    setEmail("")
    setCel("")
  };

  const handleSubmit = async() =>{
  
    const dataPartner = {
      partner:{
        name: name,
        email: email,
        celular: cel  
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify(dataPartner)
    };
  
    await fetch('http://localhost:7007/api/application/partner', config);
    setShow(true)
    new Promise (() =>{
      setTimeout(()=>{navigate("/partners")}, 400);
    }) 
    return true
    
  
  }

  return(
  <Page themeId="tool">
    <Header title="Partner"></Header>
    <Content>
    <ContentHeader title='New Partner'></ContentHeader>
    <AlertComponent open={show} close={handleClose} message={"Partner cadastrado!"}/>

      <Grid container direction="row" justifyContent="center">
      <Grid item sm={12} lg={5}>
          <InfoCard>
            <Grid container spacing={3} direction='column' justifyContent="center">
              <Grid item xs={12} >
              </Grid>
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Name"
                  value={name}
                  required
                  onChange={(e)=>{
                    setName(e.target.value)
                  }}>
                </TextField>
              </Grid>
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  value={email}
                  required
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}>
                </TextField>
              </Grid>
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Celular"
                  value={cel}
                  required
                  onChange={(e)=>{
                    setCel(e.target.value)
                  }}>
                </TextField>
              </Grid>
                          
              <Grid item xs={12} >
                <Grid container justifyContent='center' alignItems='center'>
                  <Button component={RouterLink} to={'/partners'} style={{margin:"16px"}} size='large' variant='outlined'>Cancel</Button>
                  <Button style={{margin:"16px"}} size='large' color='primary' type='submit' variant='contained' disabled={show} onClick={handleSubmit}>Create</Button>
                </Grid>
              </Grid>
              
            </Grid>
          </InfoCard>
        </Grid>
        
      </Grid>
    </Content>
  </Page>
)};



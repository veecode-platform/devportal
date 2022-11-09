import React, {useState} from 'react';
import { Grid, TextField, Button, Select, MenuItem} from '@material-ui/core';
import { Link as RouterLink} from 'react-router-dom';
import AlertComponent from '../../Alert/Alert';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader, 
} from '@backstage/core-components';


export const CreateComponent = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShow(false);
    setName("")
    setUrl("")
    setDescription("")
    setService("")
  };

  const handleSubmit = async() =>{
  
    const dataTest = {
      application:{
        creator:"luccas",
        name: name,
        serviceName:[service],
        description: description,
        active:true,
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify(dataTest)
    };
  
    const response = await fetch('http://localhost:7007/api/application/create-application', config);
    const data = await response.json();
    //console.log("data test: ", data)
    setShow(true)
    return data
    
  
  }

  return(
  <Page themeId="tool">
    <Header title="Services"></Header>
    <Content>
    <ContentHeader title='New Service'></ContentHeader>
    <AlertComponent open={show} close={handleClose} message={"Service cadastrada!"}/>

      <Grid container direction="row" justifyContent="center">
      <Grid item sm={12} lg={5}>
          <InfoCard>
            <Grid container spacing={3} direction='column' justifyContent="center">
              <Grid item xs={12} >
                <Select
                  fullWidth
                  variant="outlined"
                  value={service}
                  displayEmpty         
                  onChange={(e)=>{
                    setService(e.target.value as string);
                  }}>
                    <MenuItem value=""><em>Service name</em></MenuItem>
                    <MenuItem value={"google"}>Google</MenuItem>
                    <MenuItem value={"manager-kong"}>Kong</MenuItem>
                    <MenuItem value={"manager-kubernetes"}>Kubernetes</MenuItem>
                    <MenuItem value={"manager-kubernetes-helm"}>Kubernetes helm</MenuItem>
                    <MenuItem value={"manager-kubernetes-kubectl"}>Kubernetes kubectl</MenuItem>
                    <MenuItem value={"manager-kubernetes-kustomize"}>Kubernetes kustomize</MenuItem>
                    <MenuItem value={"manager-kubernetes-minikube"}>Kubernetes minikube</MenuItem>
                    <MenuItem value={"manager-kubernetes-minikube-kustomize"}>Kubernetes minikube kustomize</MenuItem>
                    <MenuItem value={"manager-kubernetes-minikube-kustom"}>Kubernetes minikube kustom</MenuItem>
                </Select>
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
                  label="Url"
                  required
                  value={url}
                  onChange={(e)=>{
                    setUrl(e.target.value)
                  }}>
                </TextField>
              </Grid>
              
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Description"
                  multiline
                  value={description}
                  minRows={3}
                  required
                  onChange={(e)=>{
                    setDescription(e.target.value)
                  }}>
                </TextField>
              </Grid>
              
              <Grid item xs={12} >
                <Grid container justifyContent='center' alignItems='center'>
                  <Button component={RouterLink} to={'/create-app'} style={{margin:"16px"}} size='large' variant='outlined'>Cancel</Button>
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



import React, {useState} from 'react';
import { Grid, TextField, Button, Select, MenuItem} from '@material-ui/core';
import { useLocation, Link as RouterLink, useNavigate} from 'react-router-dom';
import AlertComponent from '../../Alert/Alert';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import {Progress} from '@backstage/core-components';

import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader, 
} from '@backstage/core-components';

type Service = {
  id: string; 
  name: string; 
  description: string;
  redirectUrl: string;
  kongServiceName: string;
  kongServiceId: string; 
  createdAt: string; 
  updatedAt: string;
};

type ServiceProps = {
  service: Service | undefined;
}


 const EditPageComponent = ({service}:ServiceProps) => {

  const navigate = useNavigate();

  const [name, setName] = useState(service?.name);
  const [url, setUrl] = useState(service?.redirectUrl);
  const [description, setDescription] = useState(service?.description);
  const [serviceName, setServiceName] = useState("");
  const [show, setShow] = useState(false);


  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShow(false);
    setName("")
    setUrl("")
    setDescription("")
    setServiceName("")
  };

  const handleSubmit = async() =>{
  
    const dataTest = {
      service:{
        name: name,
        description: description,
        redirectUrl: url,
        kongServiceName:serviceName,
        kongServiceId :serviceName,
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify(dataTest)
    };
  
    await fetch(`http://localhost:7007/api/application/service/${service?.id}`, config);
    setShow(true)
    new Promise (() =>{
      setTimeout(()=>{navigate("/services")}, 400);
    }) 
    return true
    
  }

  return(
  <Page themeId="tool">
    <Header title="Service"></Header>
    <Content>
    <ContentHeader title='Edit Service'></ContentHeader>
    <AlertComponent open={show} close={handleClose} message={"Service editada!"}/>

      <Grid container direction="row" justifyContent="center">
      <Grid item sm={12} lg={5}>
          <InfoCard>
            <Grid container spacing={3} direction='column' justifyContent="center">
              <Grid item xs={12} >
                <Select
                  fullWidth
                  variant="outlined"
                  value={serviceName}
                  displayEmpty         
                  onChange={(e)=>{
                    setServiceName(e.target.value as string);
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
                  <Button component={RouterLink} to={'/services'} style={{margin:"16px"}} size='large' variant='outlined'>Cancel</Button>
                  <Button style={{margin:"16px"}} size='large' color='primary' type='submit' variant='contained' disabled={show} onClick={handleSubmit}>Save</Button>
                </Grid>
              </Grid>
              
            </Grid>
          </InfoCard>
        </Grid>
        
      </Grid>
    </Content>
  </Page>
)};


export const EditComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];

  const { value, loading, error } = useAsync(async (): Promise<Service> => {
    const response = await fetch(`http://localhost:7007/api/application/service/${id}`);
    const data = await response.json();
    //console.log(data)
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <EditPageComponent service={value}/>
}






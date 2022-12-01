import React, {useState} from 'react';
import { Grid, TextField, Button, Select, MenuItem} from '@material-ui/core';
import { Link as RouterLink, useNavigate} from 'react-router-dom';
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

type KongServices = {
  id: string;
  name: string;
}

type KongServicesArray = {
  services: KongServices[];
  value: any;
  setValue:any;
}


export const CreateComponent = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  //const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [security, setSecurity] = useState("");
  const [service, setService] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShow(false);
    setName("")
    //setUrl("")
    setDescription("")
    setService("")
  };

  const handleSubmit = async() =>{
  
    const dataTest = {
      service:{
        name: name,
        description: description,
        //redirectUrl: url,
        partnersId: [],
        kongServiceName:service,
        kongServiceId :service,
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify(dataTest)
    };
  
    await fetch('http://localhost:7007/api/application/service', config);
    setShow(true)
    new Promise (() =>{
      setTimeout(()=>{navigate("/services")}, 400);
    }) 
    return true
    
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
               <FetchKongServices valueName={service} setValue={setService}/>
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
              
              {/*<Grid item xs={12} >
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
                </Grid>*/}
              
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
                <Select
                  fullWidth
                  variant="outlined"
                  value={security}
                  displayEmpty         
                  onChange={(e)=>{
                    setSecurity(e.target.value as string);
                  }}>
                    <MenuItem value=""><em>Security</em></MenuItem>
                    <MenuItem value="none"><em>None</em></MenuItem>
                    <MenuItem value={"api key"}>Api Key</MenuItem>
                    
                </Select>
              </Grid>
              
              <Grid item xs={12} >
                <Grid container justifyContent='center' alignItems='center'>
                  <Button component={RouterLink} to={'/services'} style={{margin:"16px"}} size='large' variant='outlined'>Cancel</Button>
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

const FetchKongServices = ({valueName, setValue}:any) => {

  const { value, loading, error } = useAsync(async (): Promise<KongServices[]> => {
    const response = await fetch(`http://localhost:7007/api/application/kong-services`);
    const data = await response.json();
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <KongServicesListComponent services={value || []} value={valueName} setValue={setValue}/>
}

const KongServicesListComponent = ({services, value, setValue}:KongServicesArray) =>{

return(
  <Select
    fullWidth
    variant="outlined"
    value={value}
    displayEmpty         
    onChange={(e)=>{
      setValue(e.target.value as string);
    }}>
      <MenuItem value=""><em>Service name</em></MenuItem>
      {services.map((service)=>{
        return(
          <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
        )
      })}
  </Select>
)
}



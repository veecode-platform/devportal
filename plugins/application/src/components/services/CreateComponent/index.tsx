import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, IconButton, Tooltip, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment } from '@material-ui/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { FetchKongServices } from '../utils/kongUtils';
import { securityItems } from '../utils/common';
import { Select } from '../../shared';
import Help from '@material-ui/icons/HelpOutline';
import { createAxiosInstance } from '../../../api/Api';
import { useApi, alertApiRef, configApiRef, identityApiRef } from '@backstage/core-plugin-api'; 

export const CreateComponent = () => {
  const alert = useApi(alertApiRef)
  const config = useApi(configApiRef)
  const identity = useApi(identityApiRef)
  const axiosInstance = createAxiosInstance({config, alert, identity})

  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false)
  const [service, setService] = useState<any>({
    name: '',
    kongServiceName:'',
    active: '',
    description: '',
    kongServiceId: '',
    securityType: '',
    rateLimiting: 0,
  });
  const [loading, setLoading] = useState(false);
  const [applySecurity, setApplySecurity] = useState<boolean>(false)
  const [applyRateLimit, setApplyRateLimit] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const kongReadOnlyMode = config.getBoolean("platform.apiManagement.readOnlyMode")

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(()=>{
    const securityTypeCheck = kongReadOnlyMode ? false : applySecurity ? service.securityType==="" : false
    const rateLimitCheck = kongReadOnlyMode ? false : applyRateLimit ? service.rateLimiting===0 : false

    const x = service.name.length===0 || service.kongServiceId==="" || service.description.length===0 || securityTypeCheck || rateLimitCheck || service.active ==="";
    setError(x)
  }, [service, applyRateLimit, applySecurity])

  const handleSubmit = async () => {
    setLoading(true)
    const servicePost = {
      service: {
        name: service.name,
        kongServiceName:service.kongServiceName,
        active: service.active,
        description: service.description,
        kongServiceId: service.kongServiceId,
        rateLimiting: applyRateLimit ? service.rateLimiting : "0",
        securityType: applySecurity ? service.securityType : "none"
      },
    };
    const response = await axiosInstance.post("/services", JSON.stringify(servicePost))
    if(response) navigate('/services');
    setLoading(false)
  };

  return (
    <Page themeId="tool">
      <Header title="New Service"> </Header>
      <Content>
        <ContentHeader title="Create a new Service"/>
        <Grid container direction="row" justifyContent="center" alignItems="center" alignContent="center">
          <Grid item sm={12} lg={6}>
            <InfoCard>
              <Grid container spacing={3} direction="row" justifyContent="center">
                <Grid item xs={12} md={9}>
                  <TextField
                    // error={error}
                    fullWidth
                    variant="outlined"
                    label="Service Name"
                    value={service.name}
                    required
                    onChange={e => {
                      setService({ ...service, name: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Select
                        placeholder="Select the Status"
                        label="Service Status"
                        items={[{label:'active', value: 'true' }, {label:'inactive', value: 'false' }]}
                        onChange={e => {
                            setService({ ...service, active: e === "true" ? true : false });
                        }}
                      />
                </Grid>

                <Grid item xs={12} md={12}>
                  <FetchKongServices
                    valueName={service}
                    setValue={setService}
                  />
                </Grid>             

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Description"
                    multiline
                    value={service.description}
                    minRows={3}
                    required
                    onChange={e => {
                      setService({ ...service, description: e.target.value });
                    }}
                  />
                </Grid>

                <Grid container xs={12} justifyContent='space-between' alignContent='center' alignItems='center'>              
                  <Grid item xs={6}>
                    <FormControlLabel
                      value={applySecurity}
                      label="Apply security plugins?"
                      labelPlacement='end'
                      control={<Checkbox size='small' onChange={()=>{setApplySecurity(!applySecurity)}}/>}
                    />                                       
                    <Select
                      onChange={e => {
                        setService({ ...service, securityType: e });
                      }}
                      placeholder="Select the Security Type"
                      label="Security Type"
                      items={securityItems}
                      disabled={kongReadOnlyMode || !applySecurity}
                    />
                  </Grid>

                  <Grid item xs={6} >
                    <FormControlLabel
                        value={applyRateLimit}
                        label="Apply rate limit?"
                        labelPlacement='end'
                        control={<Checkbox size='small' onChange={()=>{setApplyRateLimit(!applyRateLimit)}}/>}
                    />
                    <TextField
                    type='number'
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">/min</InputAdornment>,
                    }}
                    value={service.rateLimiting}
                    disabled={kongReadOnlyMode || !applyRateLimit}
                    onChange={e => {
                      setService({ ...service, rateLimiting: e.target.value });
                    }}
                  />  
                  </Grid>

                </Grid>

                {kongReadOnlyMode &&
                <Grid item xs={12} md={12} lg={12}
                  style={{
                    display: "flex",
                    justifyContent: 'flex-end',
                  }}>
                  <Tooltip title="Kong read only mode ativado" placement="bottom">
                    <IconButton>
                      <Help />
                    </IconButton>
                  </Tooltip>
                </Grid>
                }
                

                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Button
                      component={RouterLink}
                      to="/services"
                      style={{ margin: '16px' }}
                      size="large"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ margin: '16px' }}
                      size="large"
                      color="primary"
                      type="submit"
                      variant="contained"
                      disabled={loading || error}
                      onClick={kongReadOnlyMode ? handleOpenDialog : handleSubmit}
                    >
                      {loading ? "loading..." : "create"}
                    </Button>
                    <ConfirmDialog show={showDialog} handleClose={handleCloseDialog} handleSubmit={handleSubmit}/>
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


type dialogProps = {
  show: boolean;
  handleClose: any;
  handleSubmit: any;
}

const ConfirmDialog = ({show, handleClose, handleSubmit}: dialogProps) =>{
  return (
    <Dialog
    open={show}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Create a service without a consumer group?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Make sure you have created a Kong consumer group by the name of your service + "-group".`}        
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit}  color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
  </Dialog>
)}

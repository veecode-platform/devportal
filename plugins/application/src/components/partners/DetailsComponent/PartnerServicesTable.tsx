/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { Table, TableColumn, Progress} from '@backstage/core-components';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Grid, Button} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import AxiosInstance from '../../../api/Api';
import { IService } from '../../services/utils/interfaces';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';

type ServiceListProps = {
  services: IService[];
  partnerId: string[];
}

type ActionsGridProps = {
  partnerId: string;
  removeHandler: (partnerId: string) => void; 
  addHandler: (partnerId: string) => void; 
}


const ActionsGrid = ({removeHandler, addHandler, partnerId}:ActionsGridProps) =>{

  return(
    <div>
      <Tooltip title="Remove">
        <IconButton aria-label="remove" onClick={()=>{removeHandler(partnerId)}}>
          <RemoveIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={()=>{addHandler(partnerId)}}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const ServicesList = ({services, partnerId}:ServiceListProps) =>{
  const [partnerList, setPartnerList] = useState(partnerId);
  const [loading, setLoading] = useState(false)
  // console.log(partners, servicePartnerId, serviceId)

  const handleSubmit = async() =>{
    setLoading(true)
    const updateServicesPartners = {
      services:{
        partnersId: partnerList,
      }
    }
    await AxiosInstance.patch(`partners/services/${partnerId}`, JSON.stringify(updateServicesPartners) )
    
    new Promise (() =>{
      setTimeout(()=>{setLoading(false)}, 500);
    })
    
  }

  const addHandler = (partnerId:string) => {
    if(partnerList.indexOf(partnerId) >= 0) return;
    const copy = partnerList
    copy.push(partnerId)
    setPartnerList([...copy])
  }
  
  const removeHandler = (partnerId:string) => {
    if(partnerList.indexOf(partnerId) === -1) return;
    let copy = partnerList
    copy = copy.filter(e => e !== partnerId)
    setPartnerList([...copy])
  }


    const columns: TableColumn[] = [
        { title: 'Id', field: 'id', width:'1fr' },
        { title: 'Name', field: 'name', width: '1fr' },
        // { title: "Status", field: "status", width: '1fr'},
        // { title: "Action", field: "action", width: '1fr'}
      ];
      // defaultGroupOrder: 1, organiza por grupos
    
      const data = services.map(service => {
        return {
            name: service.name,
            id: service.id,
            // status: partnerList.indexOf(service.id) >=0 ? "Enabled" : "Disabled",
            // action: <ActionsGrid partnerId={service.id} removeHandler={removeHandler} addHandler={addHandler}/>,
          // listed: partnerList.indexOf(partner.id) >=0 ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>
        };
      });
    
      return (       
        <>
        <Table
          title={`Services (${services.length})`}
          options={{ search: true, paging: false }}
          columns={columns}
          data={data}
        />
        <Grid style={{margin: "2vw"}} item xs={12} >
          <Grid container justifyContent='center' alignItems='center' spacing={2}>
            <Grid item><Button component={RouterLink} to="/services" variant='contained' size='large'>Cancel</Button></Grid>
            <Grid item><Button /* disabled={partnerList === servicePartnerId || loading}*/ onClick={()=>{handleSubmit()}} variant='contained' size='large'>{loading ? "Saving..." :"Save"}</Button></Grid>
          </Grid>           
        </Grid>
        </>
      );    
}

export const PartnerServiceListTable = ({partnerId}:any) => {
    const user = useApi(identityApiRef);

    const { value, loading, error } = useAsync(async (): Promise<IService[]> => {
        const userIdentityToken = await user.getCredentials()
        const {data} = await AxiosInstance.get(`/services`, {headers:{ Authorization: `Bearer ${userIdentityToken.token}`}})
        return data.services;
    }, []);
  
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }
    return <ServicesList services={value || []} partnerId={partnerId}/>;
  };